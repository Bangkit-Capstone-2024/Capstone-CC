import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { ProductModels } from "../models/Models";
import { TenantModels } from "../models/Models";

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const { name_products, pictures, description, price, stock, is_available, category_id, tenant_id } = req.body;

    // Periksa apakah tenant dengan ID yang diberikan ada di database
    const tenant = await TenantModels.findUnique({
      where: {
        id: parseInt(tenant_id),
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: "false",
        message: "Tenant not found!",
      });
    }

    // Generate slug based on product name
    const slug = slugify(name_products, { lower: true, strict: true });

    const product = await ProductModels.create({
      data: {
        name_products,
        slug,
        pictures,
        description,
        price,
        stock: parseInt(stock),
        is_available,
        category_id: parseInt(category_id),
        tenant_id: parseInt(tenant_id),
      },
    });

    res.status(201).json({
      success: "true",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_products, slug, pictures, description, price, stock, is_available, category_id, tenant_id } = req.body;

    // Periksa apakah tenant dengan ID yang diberikan ada di database
    const tenant = await TenantModels.findUnique({
      where: {
        id: parseInt(tenant_id),
      },
    });

    if (!tenant) {
      return res.status(404).json({
        success: "false",
        message: "Tenant not found!",
      });
    }

    const product = await ProductModels.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name_products,
        slug,
        pictures,
        description,
        price,
        stock: parseInt(stock),
        is_available,
        category_id: parseInt(category_id),
        tenant_id: parseInt(tenant_id),
      },
    });

    res.status(200).json({
      success: "true",
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
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

    res.status(200).json({
      success: "true",
      data: products,
    });
  } catch (error) {
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
      return res.status(404).json({
        success: "false",
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: "true",
      data: product,
    });
  } catch (error) {
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
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};
