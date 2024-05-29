import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/ProductController";

const product_controllers = express.Router();

product_controllers.post("/products", createProduct);
product_controllers.get("/products", getAllProducts);
product_controllers.get("/products/:id", getProductById);
product_controllers.patch("/products/:id", updateProduct);
product_controllers.delete("/products/:id", deleteProduct);

export default product_controllers;
