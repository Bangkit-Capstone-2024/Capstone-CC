import express from "express";
import multer from "multer";

import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController";
// const upload = multer({ storage: multer.memoryStorage() });

// Mengijinkan upload gambar dengan batasan 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const product_controllers = express.Router();

// product_controllers.post("/products", createProduct);
// product_controllers.post("/products", upload.single("pictures"), createProduct);
product_controllers.post("/products", upload.array("pictures", 8), createProduct); // Max 8 files
product_controllers.patch("/products/:id", upload.array("pictures", 8), updateProduct); // Max 8 files
product_controllers.get("/products", getAllProducts);
product_controllers.get("/products/:id", getProductById);
// product_controllers.patch("/products/:id", updateProduct);
product_controllers.delete("/products/:id", deleteProduct);

export default product_controllers;
