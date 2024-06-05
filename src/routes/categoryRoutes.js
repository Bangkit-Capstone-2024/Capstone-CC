import express from "express";
import { createCategory, getAllCategories, deleteCategory, updateCategory } from "../controllers/categoryController"; // Sesuaikan dengan path controller Anda
const authCheck = require("../middlewares/AuthCheck");


const category_controllers = express.Router();

category_controllers.post("/categories", authCheck, createCategory);
category_controllers.get("/categories", getAllCategories);
category_controllers.delete("/categories/:id", authCheck, deleteCategory);
category_controllers.patch("/categories/:id", authCheck, updateCategory);


export default category_controllers;
