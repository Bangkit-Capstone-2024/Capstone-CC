const express = require("express");
import { createBooking, getBookingsByUser, getBookingById, deleteBooking } from '../controllers/bookingController';
const authCheck = require("../middlewares/AuthCheck");

const booking_controllers = express.Router();

booking_controllers.post("/bookings", authCheck, createBooking);
booking_controllers.get("/bookings", authCheck, getBookingsByUser);
booking_controllers.get("/bookings/:id", authCheck, getBookingById);
booking_controllers.delete("/bookings/:id", authCheck, deleteBooking);

export default booking_controllers;
