import { PrismaClient } from "@prisma/client";
import { ProductModels } from "../models/Models";
import { TenantModels } from "../models/Models";
import { Storage } from "@google-cloud/storage";
import slugify from "slugify";
import crypto from "crypto";
import dotenv from "dotenv";
import multer from "multer";
import express from "express";
import logger from "../middlewares/logger";

const { classifyImage, getLabelsFromPrediction } = require('../models/mlModel');

dotenv.config();

const prisma = new PrismaClient();
const storage = new Storage();

const bucketName = process.env.GCS_BUCKET_NAME;

// Upload image to Google Cloud Storage

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

const generateUniqueSlug = (name) => {
  const randomString = crypto.randomBytes(4).toString("hex");
  return `${slugify(name, { lower: true, strict: true })}-${randomString}`;
};

// Utility function to format product pictures
const formatProductPictures = (products) => {
  return products.map(product => {
    const pictures = product.pictures.split(",");
    return {
      ...product,
      pictures: pictures.length > 0 ? pictures[0] : null,
    };
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name_products, description, price, stock, is_available, category_id, tenant_id } = req.body;

    const user_id = req.user.id;

    // Periksa apakah tenant dengan ID yang diberikan ada di database
    const tenant = await TenantModels.findFirst({
      where: {
        id: parseInt(tenant_id),
        user_id: parseInt(user_id),
      },
    });

    if (!tenant) {
      logger.warn(`Tenant not found for user: ${user_id} and tenant: ${tenant_id}`);

      return res.status(404).json({
        success: "false",
        message: "Tenant not found!",
      });
    }

    // Generate slug based on product name
    // const slug = slugify(name_products, { lower: true, strict: true });
    const slug = generateUniqueSlug(name_products);

    let pictureUrls = "";
    // if (req.file) {
    //   pictureUrl = await uploadImageToGCS(req.file, tenant.name_tenants);
    // }
    if (req.files && req.files.length > 0) {
      const folderName = `tenants/${tenant.name_tenants}/products_images;`
      const uploadPromises = req.files.map((file) => uploadImageToGCS(file, folderName));
      const uploadedUrls = await Promise.all(uploadPromises);

      // pictureUrls = await Promise.all(uploadPromises);
      pictureUrls = uploadedUrls.join(","); // Join URLs with a comma

    }

    const product = await ProductModels.create({
      data: {
        name_products,
        slug,
        pictures: pictureUrls,
        // pictures: JSON.stringify(pictureUrls), // Join multiple URLs with comma
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_available: is_available === "true" ? true : false,
        category_id: parseInt(category_id),
        tenant_id: tenant.id,
        address_tenants: tenant.address_tenants, // Include tenant's address
      },
    });

    logger.info(`Product created successfully:  ${product.name_products}`);
    res.status(201).json({
      success: "true",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};
// // Middleware untuk menangani upload file menggunakan Multer
// const upload = multer({ storage: multer.memoryStorage() });

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_products, 
      description, 
      price, stock, 
      is_available, 
      category_id,
      tenant_id } = req.body;

    const user_id = req.user.id;

    // Periksa apakah tenant dengan ID yang diberikan ada di database
    const tenant = await TenantModels.findFirst({
      where: {
        id: parseInt(tenant_id),
        user_id: parseInt(user_id),
      },
    });

    if (!tenant) {
      logger.warn(`Tenant not found for user: ${user_id} and tenant: ${tenant_id}`);

      return res.status(404).json({
        success: "false",
        message: "Tenant not found!",
      });
    }

    // Upload picture to Google Cloud Storage

    let pictureUrls = "";
    if (req.files && req.files.length > 0) {
      const folderName = `tenants/${tenant.name_tenants}/products_images;`
      const uploadPromises = req.files.map((file) => uploadImageToGCS(file, folderName));
      // const newPictureUrls = await Promise.all(uploadPromises);
      // pictureUrls = [...pictureUrls, ...newPictureUrls];
      const uploadedUrls = await Promise.all(uploadPromises);
      pictureUrls = uploadedUrls.join(","); // Join URLs with a comma
    }

    const product = await ProductModels.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name_products,
        slug: generateUniqueSlug(name_products),
        pictures: pictureUrls,
        // pictures: JSON.stringify(pictureUrls),
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        is_available: is_available === "true" ? true : false,
        category_id: parseInt(category_id),
        address_tenants: tenant.address_tenants, // Include tenant's address
      },
    });

    logger.info(`Product updated successfully:  ${product.name_products}`);

    res.status(200).json({
      success: "true",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error updating product: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Endpoint lainnya tetap sama
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModels.findMany({
      include: {
        category: true,
        tenant: true,
      },
    });

    const formattedProducts = formatProductPictures(products);

    logger.info("Retrieved all products");

    res.status(200).json({
      success: "true",
      message: "Products retrieved successfully",
      data: formattedProducts,
      // data: products,
    });
  } catch (error) {
    logger.error( `Error retrieving products: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModels.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
        tenant: true,
      },
    });

    if (!product) {
      logger.warn(`Product not found: ${id}`);

      return res.status(404).json({
        success: "false",
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: "true",
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error retrieving product: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModels.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.status(404).json({
        success: "false",
        message: "Product not found or already deleted!",
      });
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      success: "true",
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error(`Error deleting product: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Search product by name

export const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: "false",
        message: "Please provide a search term",
      });
    }

    const products = await ProductModels.findMany({
      where: {
        name_products: {
          contains: name,
          // mode: 'insensitive',
        },
      },
      include: {
        category: true,
        tenant: true,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: "false",
        message: "No products found with the given name",
      });
    }

    const formattedProducts = formatProductPictures(products);

    res.status(200).json({
      success: "true",
      message: "Products retrieved successfully",
      data: formattedProducts,
    });
  } catch (error) {
    logger.error(`Error searching for products ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const searchProductsByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: "false",
        message: "Please upload an image",
      });
    }

    const imageBuffer = req.file.buffer;
    const predictions = await classifyImage(imageBuffer);
    const label = getLabelsFromPrediction(predictions);

    console.log('Label from prediction:', label); // Debugging line

    const products = await ProductModels.findMany({
      where: {
        OR: [
          {
            name_products: {
              contains: label,
              // mode: 'insensitive',
            },
          },
          // {
          //   description: {
          //     contains: label,
          //     // mode: 'insensitive',
          //   },
          // },
        ],
      },
    });

    if (products.length === 0) {
      return res.status(200).json({
        success: "true",
        message: "No products found for the given image",
        data: products,
      });
    }

    const formattedProducts = products.map(product => {
      const pictures = JSON.parse(product.pictures);
      return {
        ...product,
        pictures: pictures.length > 0 ? pictures[0] : null,
      };
    });

    res.status(200).json({
      success: "true",
      message: "Products retrieved successfully",
      data: formattedProducts,
    });
  } catch (error) {
    console.error(`Error searching for product by image: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getProductsByTenantId = async (req, res) => {
  try {
    const { tenant_id } = req.params;

    const tenant = await TenantModels.findUnique({
      where: {
        id: parseInt(tenant_id),
      },
      include: {
        products: true,
      },
    });

    if (!tenant) {
      logger.warn(`Tenant not found: ID ${tenant_id}`);
      return res.status(404).json({
        success: "false",
        message: "Tenant not found",
      });
    }

    const formattedProducts = formatProductPictures(tenant.products);

    logger.info(`Retrieved products for tenant: ID ${tenant_id}`);
    res.status(200).json({
      success: "true",
      message: "Products retrieved successfully",
      data: formattedProducts,
    });
  } catch (error) {
    logger.error(`Error retrieving products for tenant: ${error.message}`);
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};