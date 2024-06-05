import { PrismaClient } from "@prisma/client";
import { CategoryModels } from "../models/Models";

const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  try {
    const { name_categories } = req.body;

    const category = await CategoryModels.create({
      data: {
        name_categories,
      },
    });

    res.status(201).json({
      success: "true",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModels.findMany();

    res.status(200).json({
      success: "true",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CategoryModels.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        success: "false",
        message: "Category not found or already deleted!",
      });
    }

    const productsInCategory = await CategoryModels.findMany({
      where: {
        id: parseInt(id),
      },
    });

    if (productsInCategory.length > 0) {
      return res.status(400).json({
        success: "false",
        message: "Category contains products and cannot be deleted!",
      });
    }

    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      success: "true",
      message: "Category deleted successfully",
    });
    
  } catch (error) {
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

    const updatedCategory = await CategoryModels.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name_categories,
      },
    });

    res.status(200).json({
      success: "true",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};