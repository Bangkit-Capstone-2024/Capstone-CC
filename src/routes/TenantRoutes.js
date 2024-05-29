const express = require("express");
const tenant_controllers = express.Router();
const { createTenant, getAllTenants, getTenantById, updateTenant, deleteTenant } = require("../controllers/TenantController"); // Sesuaikan dengan path controller Anda

tenant_controllers.post("/tenants", createTenant);
tenant_controllers.get("/tenants", getAllTenants);
tenant_controllers.get("/tenants/:id", getTenantById);
tenant_controllers.patch("/tenants/:id", updateTenant);
tenant_controllers.delete("/tenants/:id", deleteTenant);

export default tenant_controllers;
