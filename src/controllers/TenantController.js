const { PrismaClient } = require("@prisma/client");
import { TenantModels } from "../models/Models";
import { UsersModels } from "../models/Models";

const prisma = new PrismaClient();

// Membuat tenant baru
export const createTenant = async (req, res) => {
  try {
    const { user_id, name_tenants, address_tenants } = req.body;

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

    // Periksa apakah pengguna sudah memiliki tenant
    const existingTenant = await TenantModels.findFirst({
      where: {
        user_id: parseInt(user_id),
      },
    });

    if (existingTenant) {
      return res.status(403).json({
        success: "false",
        message: "User already has a tenant",
      });
    }

    // Buat tenant baru
    const tenant = await TenantModels.create({
      data: {
        user_id: parseInt(user_id),
        name_tenants: name_tenants,
        address_tenants: address_tenants,
      },
    });

    res.status(201).json({
      success: "true",
      message: "Tenant created successfully",
      data: tenant,
      tenant,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// Mendapatkan semua tenant
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await TenantModels.findMany();

    res.status(200).json({
      success: "true",
      data: tenants,
      tenants,
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
    });

    if (!tenant) {
      return res.status(404).json({
        success: "false",
        message: "Tenant not found",
      });
    }

    res.status(200).json({
      success: "true",
      data: tenant,
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

    const tenant = await TenantModels.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name_tenants: name_tenants,
        address_tenants: address_tenants,
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
