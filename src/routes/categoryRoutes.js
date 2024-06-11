import express from "express";
import multer from "multer";

import { createCategory, getAllCategories, deleteCategory, updateCategory } from "../controllers/categoryController"; // Sesuaikan dengan path controller Anda
const authCheck = require("../middlewares/AuthCheck");

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

const category_controllers = express.Router();

category_controllers.post("/categories", upload.single('image'), authCheck, createCategory);
category_controllers.get("/categories", getAllCategories);
category_controllers.delete("/categories/:id", authCheck, deleteCategory);
category_controllers.patch("/categories/:id",  upload.single('image'), authCheck, updateCategory);


export default category_controllers;
