import rateLimit from "express-rate-limit";
import express from "express";
import {
    UsersCreate,
    UsersLogin,
    UsersLogout,
    UsersRead,
    UsersUpdate,
    UsersDelete,
    UsersAuth,
    UsersVerifyEmail,
    UsersResendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    UserGoogleAuth,
} from "../controllers/UsersControllers";
const CheckBlacklist = require("../middlewares/CheckBlacklist");
const authCheck = require("../middlewares/AuthCheck");
import multer from "multer";

const users_controllers = express.Router();

const LimitLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message:
        "Too much pressing the screen, please wait a little longer up to 15 minutes !!",
});

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

// CREATE USER ROUTES

users_controllers.post("/users/register", UsersCreate);
users_controllers.post("/users/login", LimitLogin, UsersLogin);
users_controllers.post("/users/login-google", LimitLogin, UserGoogleAuth);
//users_controllers.post("/users/logout", authCheck, UsersLogout);
users_controllers.post("/users/read", authCheck, UsersRead);
users_controllers.patch(
    "/users/update/:id",
    authCheck,
    CheckBlacklist,
    upload.single("avatar"),
    UsersUpdate
);
users_controllers.delete(
    "/users/delete/:id",
    authCheck,
    CheckBlacklist,
    UsersDelete
);
// users_controllers.get("/users/auth", UsersAuth);

users_controllers.get("/users/verify-email/:id/:token", UsersVerifyEmail);
users_controllers.post(
    "/users/resend-verification-email",
    UsersResendVerificationEmail
);

users_controllers.post("/users/request-password-reset", requestPasswordReset);
users_controllers.post("/users/reset/:token", resetPassword);

users_controllers.post("/users/logout", authCheck, CheckBlacklist, UsersLogout);

export default users_controllers;
