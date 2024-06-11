const express = require("express");
const tenant_controllers = express.Router();
const authCheck = require("../middlewares/AuthCheck");
import multer from "multer";

// Filter file untuk memastikan hanya gambar yang diizinkan
const imageFilter = (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
      console.error("Only image files are allowed!");
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };
  
  // Mengijinkan upload gambar dengan batasan 5MB
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  });

import { createTenant, getAllTenants, getTenantById, updateTenant, deleteTenant } from "../controllers/tenantController"; // Sesuaikan dengan path controller Anda

tenant_controllers.post("/tenants", upload.single('image'), authCheck, createTenant);
tenant_controllers.get("/tenants", authCheck, getAllTenants);
tenant_controllers.get("/tenants/:id", authCheck, getTenantById);
tenant_controllers.patch("/tenants/:id", upload.single('image'), authCheck, updateTenant);
tenant_controllers.delete("/tenants/:id", authCheck, deleteTenant);

export default tenant_controllers;
