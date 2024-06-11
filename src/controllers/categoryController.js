import { PrismaClient } from "@prisma/client";
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";
import { CategoryModels } from "../models/Models";
import logger from "../middlewares/logger";

const prisma = new PrismaClient();
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME;

// Upload image to Google Cloud Storage
const uploadImageToGCS = async (file, folderName) => {
  const bucket = storage.bucket(bucketName);
  const fileName = `${folderName}/${crypto.randomBytes(16).toString("hex")}-${file.originalname}`;
  const blob = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.end(file.buffer);
  });
};

const moveFilesInGCS = async (oldFolderName, newFolderName) => {
  const [files] = await storage.bucket(bucketName).getFiles({
    prefix: oldFolderName,
  });

  for (const file of files) {
    const newFileName = file.name.replace(oldFolderName, newFolderName);
    await file.move(newFileName);
  }
};

const deleteFolderFromGCS = async (folderName) => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: folderName,
    });

    const deletePromises = files.map(file => file.delete());
    await Promise.all(deletePromises);
    logger.info(`Deleted folder ${folderName} from GCS`);
  } catch (error) {
    logger.error(`Error deleting folder from GCS: ${error.message}`);
    throw new Error('Failed to delete folder from GCS');
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name_categories } = req.body;
    let imageUrl = null;

    if (req.file) {
      const folderName = `categories/${name_categories}`;
      imageUrl = await uploadImageToGCS(req.file, folderName);
    }

    const category = await CategoryModels.create({
      data: {
        name_categories,
        image: imageUrl,
      },
    });

    logger.info(`Category created: ${category.name_categories}`);


    res.status(201).json({
      success: "true",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    logger.error(`Error creating category: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          // select: {
          //   name_products: true,
          // },
        }
      },
    });

    const categoriesWithProductCount = categories.map((category) => ({
      ...category,
      amount: category.products.length,
    }));

    logger.info(`Retrieved all categories`);

    res.status(200).json({
      success: "true",
      data: categoriesWithProductCount,
    });
  } catch (error) {
    logger.error(`Error retrieving categories: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const category = await CategoryModels.findUnique({
      where: {
        id: parseInt(id),
      },
        include: {
          products: true ,
      },
    });

    if (!category) {
      logger.warn(`Category not found or already deleted: ID ${id}`);
      return res.status(404).json({
        success: "false",
        message: "Category not found or already deleted!",
      });
    }

    // Check if there are products in the category
    if (category.products.length > 0) {
      logger.warn(`Cannot delete category with products: ${category.name_categories}`);
      return res.status(400).json({
        success: "false",
        message: "Category contains products and cannot be deleted!",
      });
    }

    // Delete images from GCS
    await deleteFolderFromGCS(`categories/${category.name_categories}`);

    await CategoryModels.delete({
      where: {
        id: parseInt(id),
      },
    });
    logger.info(`Category deleted: ${category.name_categories}`);


    res.status(200).json({
      success: "true",
      message: "Category deleted successfully",
    });
    
  } catch (error) {
    logger.error(`Error deleting category: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_categories } = req.body;
    //let updatedData = { name_categories };

    // if (req.file) {
    //   const folderName = `categories/${name_categories}`;
    //   const imageUrl = await uploadImageToGCS(req.file, folderName);
    //   updatedData.image = imageUrl;
    // }

    const category = await CategoryModels.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        success: "false",
        message: "Category not found",
      });
    }

    const oldFolderName = `categories/${category.name_categories}`;
    const newFolderName = `categories/${name_categories}`;

    if (category.name !== name_categories) {
      await moveFilesInGCS(oldFolderName, newFolderName);
    }

    let updatedData = { name_categories };

    if (req.file) {
      const folderName = `categories/${name_categories}`;
      const imageUrl = await uploadImageToGCS(req.file, folderName);
      updatedData.image = imageUrl;
    }

    const updatedCategory = await CategoryModels.update({
      where: {
        id: parseInt(id),
      },
      data: updatedData,
    });

    logger.info(`Category updated: ${updatedCategory.name_categories}`);

    res.status(200).json({
      success: "true",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    logger.error(`Error updating category: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};