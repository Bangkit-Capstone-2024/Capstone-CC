import express from "express";
import multer from "multer";

import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } from "../controllers/productController";
// const upload = multer({ storage: multer.memoryStorage() });

// Filter file untuk memastikan hanya gambar yang diizinkan
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
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

const product_controllers = express.Router();

// product_controllers.post("/products", createProduct);
// product_controllers.post("/products", upload.single("pictures"), createProduct);
product_controllers.post("/products", upload.array("pictures", 8), createProduct); // Max 8 files
product_controllers.patch("/products/:id", upload.array("pictures", 8), updateProduct); // Max 8 files
product_controllers.get("/products", getAllProducts);
product_controllers.get("/products/search", searchProducts);
product_controllers.get("/products/:id", getProductById);
// product_controllers.patch("/products/:id", updateProduct);
product_controllers.delete("/products/:id", deleteProduct);

export default product_controllers;
