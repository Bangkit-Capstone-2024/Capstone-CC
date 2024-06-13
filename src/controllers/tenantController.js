const { PrismaClient } = require("@prisma/client");
import { TenantModels } from "../models/Models";
import { UsersModels } from "../models/Models";
import axios from "axios";
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";
import logger from "../middlewares/logger";

const prisma = new PrismaClient();

// UPLOAD IMAGES TO GCS

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

const uploadImageToGCS = async (file, folderName) => {
  const bucket = storage.bucket(bucketName);
  const fileName = `${folderName}/${crypto.randomBytes(16).toString("hex")}-${file.originalname}`;
  const blob = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.end(file.buffer);
  });
};

// Delete folder from GCS
const deleteFolderFromGCS = async (folderName) => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: folderName,
    });

    if (files.length === 0) {
      logger.info(`No files found in folder ${folderName} to delete`);
      return;
    }

    const deletePromises = files.map(file => file.delete());
    await Promise.all(deletePromises);
    logger.info(`Deleted folder ${folderName} from GCS`);
  } catch (error) {
    logger.error(`Error deleting folder from GCS: ${error.message}`);
    throw new Error('Failed to delete folder from GCS');
  }
};

// Membuat tenant baru
export const createTenant = async (req, res) => {
  try {
    const { name_tenants, address_tenants } = req.body;
    const user_id = req.user.id;

    // Periksa apakah user_id ada di database
    const user = await UsersModels.findUnique({
      where: {
        id: parseInt(user_id),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: "false",
        message: "User ID not found!",
      });
    }

    // Periksa apakah pengguna sudah memiliki tenant (jika 1 user hanya diijinkan untuk membuat 1 tenant)
    // const existingTenant = await TenantModels.findFirst({
    //   where: {
    //     user_id: parseInt(user_id),
    //   },
    // });

    // if (existingTenant) {
    //   return res.status(403).json({
    //     success: "false",
    //     message: "User already has a tenant",
    //   });
    // }

    // Fetch location data from Google Maps API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address_tenants,
        key: apiKey,
        language: 'id',
      },
    });

    const locationData = response.data.results[0];

    if (!locationData) {
      return res.status(400).json({
        success: "false",
        message: "Invalid address",
      });
    }

    const formattedAddress = locationData.formatted_address;
    const { lat, lng } = locationData.geometry.location;

    let imageUrl = null;
    if (req.file) {
      const folderName = `tenants/${name_tenants}/images_tenant`;
      imageUrl = await uploadImageToGCS(req.file, folderName);
    }

    // Buat tenant baru
    const tenant = await TenantModels.create({
      data: {
        user_id,
        name_tenants,
        image: imageUrl,
        address_tenants: formattedAddress, // Store the formatted address
        location_lat: lat, // Add latitude field
        location_lng: lng, // Add longitude field      
      },
    });

    res.status(201).json({
      success: "true",
      message: "Tenant created successfully",
      data: tenant,
      // tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Mendapatkan semua tenant dengan nama dan jumlah produk yang dimiliki
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await TenantModels.findMany({
      include: {
        products: true,
      },
    });

    const tenantsWithProductCount = tenants.map((tenant) => ({
      ...tenant,
      totalProducts: tenant.products.length,
    }));

    res.status(200).json({
      success: "true",
      data: tenantsWithProductCount,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Mendapatkan tenant berdasarkan ID User
export const getTenantsByUser = async (req, res) => {
  try {
    
    const user_id = req.user.id;

    const tenants = await TenantModels.findMany({
      where: {
        user_id: parseInt(user_id),
      },
      include: {
        products: true,
      },
    });

    const tenantsWithProductCount = tenants.map((tenant) => ({
      ...tenant,
      totalProducts: tenant.products.length,
    }));

    res.status(200).json({
      success: "true",
      data: tenantsWithProductCount,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Mendapatkan tenant berdasarkan ID Tenant
export const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await TenantModels.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        products: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: "false",
        message: "Tenant not found",
      });
    }

    // Hitung total produk yang dimiliki oleh tenant
    const totalProducts = tenant.products.length;

    res.status(200).json({
      success: "true",
      data: {
        ...tenant,
        totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};



// Memperbarui tenant berdasarkan ID
export const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_tenants, address_tenants } = req.body;

    // Fetch location data from Google Maps API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address_tenants,
        key: apiKey,
        language: 'id',
      },
    });

    const locationData = response.data.results[0];

    if (!locationData) {
      return res.status(400).json({
        success: "false",
        message: "Invalid address",
      });
    }

    const formattedAddress = locationData.formatted_address;
    const { lat, lng } = locationData.geometry.location;

    let updatedData = {
      name_tenants,
      address_tenants: formattedAddress,
      location_lat: lat,
      location_lng: lng,
    };

    if (req.file) {
      const folderName = `tenants/${name_tenants}/images_tenant`;
      const imageUrl = await uploadImageToGCS(req.file, folderName);
      updatedData.image = imageUrl;
    }

    const tenant = await TenantModels.update({
      where: {
        id: parseInt(id),
      },
      data: updatedData,
    });

    res.status(200).json({
      success: "true",
      message: "Tenant updated successfully",
      data: tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Menghapus tenant berdasarkan ID
export const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await TenantModels.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: "false",
        message: "Tenant not found or already deleted!",
      });
    }

    // Delete tenant's image folder in GCS
    await deleteFolderFromGCS(`tenants/${tenant.name_tenants}/images_tenant`);

    await TenantModels.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      success: "true",
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};
