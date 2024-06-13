import { PrismaClient } from "@prisma/client";
import { BookingModels, ProductModels } from "../models/Models";

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { product_id, startDate, endDate } = req.body;
    const user_id = req.user.id;

    // Ensure the product exists and is available
    const product = await ProductModels.findUnique({
      where: {
        id: parseInt(product_id),
      },
    });

    if (!product || !product.is_available) {
      return res.status(404).json({
        success: "false",
        message: "Product not available",
      });
    }

    if (product.stock <= 0) {
      logger.warn(`Product out of stock: ID ${product_id}`);
      return res.status(400).json({
        success: "false",
        message: "Product is out of stock",
      });
    }

    // Calculate the total price based on rental period and product price
    const rentalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = rentalDays * product.price;

    // Create the booking
    const booking = await BookingModels.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        user_id: parseInt(user_id),
        product_id: parseInt(product_id),
      },
    });

    // Update the product stock
    const newStock = product.stock - 1;
    await ProductModels.update({
        where: {
          id: parseInt(product_id),
        },
        data: {
          stock: product.stock - 1,
          is_available: newStock > 0,
        },
    });

    res.status(201).json({
      success: "true",
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await BookingModels.findMany({
      where: {
        user_id: parseInt(user_id),
      },
      include: {
        product: {
          include: {
            tenant: {
              select: {
                id: true,
                user_id: true,
                name_tenants: true,
                address_tenants: true,
              },
              }
            }
          },
        },
      });

    res.status(200).json({
      success: "true",
      data: bookings,
    });
  } catch (error) {
    logger.error(`Error retrieving bookings for user: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModels.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: "false",
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: "true",
      data: booking,
    });
  } catch (error) {
    logger.error(`Error retrieving booking: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModels.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        product: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: "false",
        message: "Booking not found or already canceled!",
      });
    }

    // Increase the product's stock by 1
    const newStock = booking.product.stock + 1;
    await ProductModels.update({
      where: { 
        id: booking.product_id 
      },
      data: { 
        stock: newStock,
        is_available: true,
      },
    });

    await prisma.booking.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      success: "true",
      message: "Booking canceled successfully",
    });
  } catch (error) {
    logger.error(`Error cancelling booking: ${error.message}`);

    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};
