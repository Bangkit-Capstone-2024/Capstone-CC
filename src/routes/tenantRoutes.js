const express = require("express");
const tenant_controllers = express.Router();
const authCheck = require("../middlewares/AuthCheck");

import { createTenant, getAllTenants, getTenantById, updateTenant, deleteTenant } from "../controllers/tenantController"; // Sesuaikan dengan path controller Anda

tenant_controllers.post("/tenants", authCheck, createTenant);
tenant_controllers.get("/tenants", authCheck, getAllTenants);
tenant_controllers.get("/tenants/:id", authCheck, getTenantById);
tenant_controllers.patch("/tenants/:id", authCheck, updateTenant);
tenant_controllers.delete("/tenants/:id", authCheck, deleteTenant);

export default tenant_controllers;
