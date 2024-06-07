const { PrismaClient } = require("@prisma/client");
import { TenantModels } from "../models/Models";
import { UsersModels } from "../models/Models";
import axios from "axios";

const prisma = new PrismaClient();

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

    // Buat tenant baru
    const tenant = await TenantModels.create({
      data: {
        user_id,
        name_tenants,
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

// Mendapatkan tenant berdasarkan ID
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

    const tenant = await TenantModels.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name_tenants,
        address_tenants: formattedAddress, // Store the formatted address
        location_lat: lat, // Add latitude field
        location_lng: lng, // Add longitude field  
      },
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
