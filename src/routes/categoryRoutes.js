import express from "express";
import { createCategory, getAllCategories, deleteCategory } from "../controllers/categoryController"; // Sesuaikan dengan path controller Anda

const category_controllers = express.Router();

category_controllers.post("/categories", createCategory);
category_controllers.get("/categories", getAllCategories);
category_controllers.delete("/categories/:id", deleteCategory);

export default category_controllers;
