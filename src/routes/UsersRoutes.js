import rateLimit from "express-rate-limit";
import express from "express";
import { UsersCreate, UsersLogin, UsersLogout, UsersRead, UsersUpdate, UsersDelete, UsersAuth, UsersVerifyEmail, UsersResendVerificationEmail } from "../controllers/UsersControllers";
const CheckBlacklist = require("../middlewares/CheckBlacklist");
const authCheck = require("../middlewares/AuthCheck");

const users_controllers = express.Router();

const LimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too much pressing the screen, please wait a little longer up to 15 minutes !!",
});

// CREATE USER ROUTES

users_controllers.post("/users/create", UsersCreate);
users_controllers.post("/users/login", LimitLogin, UsersLogin);
//users_controllers.post("/users/logout", authCheck, UsersLogout);
users_controllers.post("/users/read", authCheck, UsersRead);
users_controllers.patch("/users/update/:id", authCheck, UsersUpdate);
users_controllers.delete("/users/delete/:id", authCheck, CheckBlacklist, UsersDelete);
// users_controllers.get("/users/auth", UsersAuth);

users_controllers.get("/users/verify-email/:id/:token", UsersVerifyEmail);
users_controllers.post("/users/resend-verification-email", UsersResendVerificationEmail);

users_controllers.post("/users/logout", authCheck, CheckBlacklist, UsersLogout);

export default users_controllers;
