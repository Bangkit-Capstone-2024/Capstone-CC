const salt = bcryptjs.genSaltSync(10);
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import crypto from "crypto";
import env from "dotenv";
import { UsersModels } from "../models/Models";
import { TokensBlacklistModels } from "../models/Models";
import { text } from "express";
import nodemailer from "nodemailer";
const fs = require("fs");
const path = require("path");
import { Storage } from "@google-cloud/storage";
import axios from "axios";
import { create } from "domain";
import logger from "../middlewares/logger";


const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

env.config();

// TRANSPORTER FOR NODEMAILER

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
    },
});

// GOOGLE CLOUD STORAGE TO UPLOAD AVATAR

const storage = new Storage();

const bucketName = process.env.GCS_BUCKET_NAME;

const uploadImageToGCS = async (file, folderName) => {
    const bucket = storage.bucket(bucketName);
    const fileName = `${folderName}/${crypto.randomBytes(16).toString("hex")}-${
        file.originalname
    }`;
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

// CREATE USERS

export const UsersCreate = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // CHECK UNIQUE EMAIL
        const checkUniqueEmail = await UsersModels.findUnique({
            where: {
                email: email,
            },
        });

        if (checkUniqueEmail) {
          if (checkUniqueEmail.isVerified) {
            return res.status(401).json({
              success: "false",
              message: "Email is already verified",
            });
          } else {
            logger.warn(`Email already exists: ${email}`);

            return res.status(401).json({
              success: "false",
              message: "Email already exists",
            });
          }
        }

        const userModel = await createUser({
            uEmail: email,
            uName: username,
            uPassword: password,
        });

        const token = getJwtToken(userModel);
        generateVerificationLink(userModel);

        //Logging Kirim email verifikasi
        logger.info(`User ${userModel.username} created successfully. Email verification sent to ${userModel.email}`);

        // Set authentication cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: "true",
            message:
                "User created successfully. Please check your email to verify your account.",
            data: {
                id: userModel.id,
                email: userModel.email,
                username: userModel.username,
            },
        });

        // res.redirect('/homepage')
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);

        return res.status(500).json({
            success: "false",
            error: `Terjadi kesalahan : ${error.message}`,
        });
    }
};

//USERS VERIFY EMAIL
export const UsersVerifyEmail = async (req, res) => {
    try {
        const { id, token } = req.params;

        if (!token || !id) {
            return res.status(400).json({
                success: "false",
                message: "Token or ID is missing",
            });
        }

        const decryptedBytes = CryptoJS.AES.decrypt(
            decodeURIComponent(token),
            process.env.API_SECRET
        );
        const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

        const decoded = jwt.verify(decryptedToken, process.env.API_SECRET);

        if (decoded.id !== parseInt(id, 10)) {
            return res.status(400).json({
                success: "false",
                message: "Invalid token or ID",
            });
        }

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({
                success: "false",
                message: "Token expired",
            });
        }

        const user = await UsersModels.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if (!user) {
            return res.status(400).json({
                success: "false",
                message: "Invalid token or user does not exist",
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                success: "true",
                message: "Email is already verified",
            });
        }

        await UsersModels.update({
            where: {
                id: user.id,
                username: user.username,
            },
            data: {
                isVerified: true,
            },
        });

        // Read email template
        const templatePath = path.join(
            __dirname,
            "../emailTemplates",
            "verifiedEmail.html"
        );
        const template = fs.readFileSync(templatePath, "utf8");

        // Replace placeholder with actual link
        let htmlToSend = template.replace(/{{username}}/g, user.username);
        htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);

        // Send notification email
        await transporter.sendMail({
            from: process.env.ZOHO_EMAIL,
            to: user.email,
            subject: "Email Verified Successfully!",
            html: htmlToSend,
        });

        logger.info(`Verification email send to ${user.email}`);

        res.status(200).send(`
        <html>
          <head>
            <title>Email Verified!</title>
          </head>
          <body>
            <h2> Hello, ${user.username} </h2>
            <h2>Your account has been successfully verified</h2>
          </body>
        </html>
      `);
        logger.info(`User ${user.username} verified successfully.`);
    } catch (error) {
        logger.error(`${error.message}`);
        res.status(500).json({
            success: "false",
            error: error.message,
        });
    }
};

// USERS RESEND EMAIL VERIFICATION

export const UsersResendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: "false",
                message: "Email is required",
            });
        }

        const user = await UsersModels.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: "false",
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: "false",
                message: "Email is already verified",
            });
        }

        // CREATE TOKEN

        // Generate verification link
        generateVerificationLink(user);

        res.status(200).json({
            success: "true",
            message: "Verification email resent successfully",
        });

        logger.info(`Verification email resent to ${user.email} successfully`);
    } catch (error) {
        logger.error(`User resend verification error ${error.message}`);


        res.status(500).json({
            success: "false",
            error: error.message,
        });
    }
};

const getJwtToken = (user) => {
    // CREATE TOKEN
    const token = jwt.sign(
        {
            app_id: process.env.APP_ID,
            id: user.id,
            email: user.email,
            username: user.username,
        },
        process.env.API_SECRET,
        {
            expiresIn: "1d",
        }
    );
    return token;
};

const getHashToken = (user) => {
    const token = getJwtToken(user);
    const hashToken = CryptoJS.AES.encrypt(
        token,
        process.env.API_SECRET
    ).toString();

    return hashToken;
};

const generateVerificationLink = async (user) => {
    const hashToken = getHashToken(user);
    // Generate verification link
    const verificationLink = `${
        process.env.CLIENT_URL
    }/api/v1/users/verify-email/${user.id}/${encodeURIComponent(hashToken)}`;

    // Read email template
    const templatePath = path.join(
        __dirname,
        "../emailTemplates",
        "verificationEmail.html"
    );
    const template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholder with actual link
    let htmlToSend = template.replace(/{{username}}/g, user.username);
    htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);
    htmlToSend = htmlToSend.replace(/{{verificationLink}}/g, verificationLink);

    // Send verification email
    await transporter.sendMail({
        from: process.env.ZOHO_EMAIL,
        to: user.email,
        subject: "Email Verification for Your Momee.id Account",
        html: htmlToSend,
    });
};

const createUser = async ({ uName, uEmail, uPassword, isFromGoogleAuth }) => {
    const userModel = await UsersModels.create({
        data: {
            email: uEmail,
            password: uPassword ? bcryptjs.hashSync(uPassword, 10) : "", // jangan lupa mendefinisikan salt dengan benar
            username: uName,
            isVerified: isFromGoogleAuth ? true : false,
        },
    });
    return userModel;
};

// USERS GOOGLE AUTH
export const UserGoogleAuth = async (req, res) => {
    try {
        const userIdToken = req.body.token;
        const ticket = await client.verifyIdToken({
            idToken: userIdToken,
            audience:
                "681901416946-38dlu7dbdvr27q84qeq8qkk5um4thjrd.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userName = payload["given_name"];
        const userEmail = payload["email"];
        const isUserExist = await UsersModels.findUnique({
            where: {
                email: userEmail,
            },
        });

        // check if user not exist
        if (!isUserExist) {
            const userModel = await createUser({
                uEmail: userEmail,
                uName: userName,
                isFromGoogleAuth: true,
            });
            return res.status(200).json({
                success: "true",
                message: "Google Auth Register Successfully",
                data: {
                    id: userModel.id,
                    email: userModel.email,
                    username: userModel.username,
                    isVerified: userModel.isVerified,
                    token: `${getHashToken(userModel)}`,
                },
            });
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json({
            success: "true",
            message: "Google Auth Login successfully",
            data: {
                id: isUserExist.id,
                email: isUserExist.email,
                username: isUserExist.username,
                isVerified: isUserExist.isVerified,
                token: `${getHashToken(isUserExist)}`,
            },
        });
    } catch (e) {
        logger.error(`Terjadi kesalahan ${e.message}`);
        res.status(500).json({
            success: "false",
            message: `Terjadi kesalahan ${e.message}`,
        });
    }
};

// USERS LOGIN

export const UsersLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;
        const Usercheck = await UsersModels.findUnique({
            where: {
                email: email,
            },
        });
        if (!Usercheck) {
            logger.warn(`Email or Password Incorrect : ${Usercheck.username}`);
            return res.status(401).json({
                success: "false",
                message: "Email or Password Incorrect",
            });
        }

        const comparePassword = await bcryptjs.compareSync(
            password,
            Usercheck.password
        );

        if (!comparePassword) {
            logger.warn(`Email or Password Incorrect : ${Usercheck.username}`);

            return res.status(401).json({
                success: "false",
                message: "Email or Password Incorrect",
            });
        }

        const token = await jwt.sign(
            {
                app_name: process.env.APP_NAME,
                id: Usercheck.id,
                email: Usercheck.email,
                username: Usercheck.username,
            },
            process.env.API_SECRET,
            {
                expiresIn: "10d",
            }
        );

        const hashToken = await CryptoJS.AES.encrypt(
            token,
            process.env.API_SECRET
        ).toString();

        res.setHeader("Access-Control-Allow-Origin", "*");

        logger.info(`User logged in: ${Usercheck.username}`);
        res.status(200).json({
            success: "true",
            message: "Login successfully",
            data: {
                id: Usercheck.id,
                email: Usercheck.email,
                username: Usercheck.username,
                isVerified: Usercheck.isVerified,
                token: `${hashToken}`,
            },
        });
    } catch (error) {
        logger.error(`Error logging in user: ${error.message}`);

        res.status(500).json({
            success: "false",
            message: error.message,
        });
    }
};

// USERS READ ALL (for admin)
export const UsersRead = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = await req.query;
        let skip = (page - 1) * limit;
        const { filter } = await req.body;
        const result = await UsersModels.findMany({
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { id: "desc" },
            where: filter,
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                phone: true,
                gender: true,
                address: true,
            },
        });

        const conn = await UsersModels.count();

        logger.info(`Retrieved all users for page: ${page}`);
        res.status(200).json({
            success: "true",
            message: "List users",
            current_page: parseInt(page),
            total_page: Math.ceil(conn / limit),
            total_data: conn,
            query: result,
        });
    } catch (error) {
        logger.error(`Error retrieving users: ${error.message}`);
        res.status(500).json({
            success: "false",
            message: error.message,
        });
    }
};

// Fetch location data from Google Maps API

const getFormattedAddress = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${apiKey}`
    );

    if (response.data.status !== "OK") {
        throw new Error("Error fetching address from Google Maps API");
    }

    const result = response.data.results[0];
    return {
        formattedAddress: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
    };
};

// USERS UPDATE

export const UsersUpdate = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;

        // CHECK UNIQUE ID
        const checkUniqueId = await UsersModels.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!checkUniqueId) {
            logger.warn(`User ID not found: ${id}`);

            return res.status(404).json({
                success: "false",
                message: "User ID not found!",
            });
        }

        let updatedData = {};

        if (data.username) {
            updatedData.username = data.username;
        }

        if (data.password) {
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            updatedData.password = hashedPassword;
        }

        if (req.file) {
            const folderName = `users/${checkUniqueId.username}/avatars`;
            const avatarUrl = await uploadImageToGCS(req.file, folderName);
            updatedData.avatar = avatarUrl;
        }

        if (data.phone) {
            updatedData.phone = data.phone;
        }

        if (data.gender) {
            updatedData.gender = data.gender;
        }

        if (data.address) {
            const addressData = await getFormattedAddress(data.address);
            updatedData.address = addressData.formattedAddress;
            updatedData.address_lat = addressData.lat;
            updatedData.address_lng = addressData.lng;
        }

        const result = await UsersModels.update({
            where: {
                id: parseInt(id),
            },
            data: updatedData,
        });

        logger.info(`User updated successfully: ${result.username}`);

        res.status(201).json({
            success: "true",
            message: "User updated successfully!",
            data: {
                id: result.id,
                email: result.email,
                username: result.username,
                avatar: result.avatar,
                phone: result.phone,
                gender: result.gender,
                address: result.address,
                address_lat: result.address_lat,
                address_lng: result.address_lng,
            },
        });
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);

        res.status(500).json({
            success: "false",
            error: error.message,
        });
    }
};

// USERS LOGOUT

export const UsersLogout = async (req, res) => {
    try {
        const authHeader = await req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: "false",
                message: "Access denied, token missing!",
            });
        }

        // save the token to blacklist

        await TokensBlacklistModels.create({
            data: {
                token: token,
            },
        });

        res.status(200).json({
            success: "true",
            message: "Logout successfully",
        });
    } catch (error) {
        logger.error(`Error logging out user: ${error.message}`);

        res.status(500).json({
            success: "false",
            error: error.message,
        });
    }
};

// USERS DELETE

export const UsersDelete = async (req, res) => {
    try {
        const { id } = await req.params;

        const checkId = await UsersModels.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!checkId) {
            return res.status(404).json({
                success: "false",
                message: "User id not found",
            });
        }

        const result = await UsersModels.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(200).json({
            success: "true",
            message: "Successfully delete users!",
        });
        console.log(`User ${checkId.username} deleted successfully`);
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);

        res.status(500).json({
            success: "false",
            error: error.message,
        });
    }
};

// USERS RESET/FORGOT PASSWORD

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UsersModels.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            logger.warn(`User with this email does not exist: ${email}`);

            return res.status(404).json({
                success: "false",
                message: "User with this email does not exist",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await UsersModels.update({
            where: { email },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        });

        // Generate resetPasswordLink

        const resetPasswordLink = `${process.env.CLIENT_URL}/api/v1/users/reset/${token}`;

        // Read email template
        const templatePath = path.join(
            __dirname,
            "../emailTemplates",
            "requestResetPassword.html"
        );
        const template = fs.readFileSync(templatePath, "utf8");

        // Replace placeholder with actual link
        let htmlToSend = template.replace(/{{username}}/g, user.username);
        htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);
        htmlToSend = htmlToSend.replace(
            /{{resetPasswordLink}}/g,
            resetPasswordLink
        );

        const mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to: user.email,
            subject: "Reset Password Request",
            html: htmlToSend,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error(`Error sending email: ${err}`);
                return res.status(500).json({
                    success: "false",
                    message: "Error sending email",
                    error: err.message,
                });
            }

            logger.info(`Reset Password send to ${user.email}`);
            res.status(200).json({
                success: "true",
                message:
                    "Email sent to " + email + " with further instructions",
            });
        });
    } catch (error) {
        logger.error(`Error requesting password reset: ${error.message}`);

        res.status(500).json({
            success: "false",
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await UsersModels.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gte: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                success: "false",
                message: "Password reset token is invalid or has expired",
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        await UsersModels.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        // Read email template
        const templatePath = path.join(
            __dirname,
            "../emailTemplates",
            "confirmResetPassword.html"
        );
        const template = fs.readFileSync(templatePath, "utf8");

        // Replace placeholder with actual link
        let htmlToSend = template.replace(/{{username}}/g, user.username);
        htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);

        const mailOptions = {
            from: process.env.ZOHO_EMAIL,
            to: user.email,
            subject: "Password Reset Confirmation",
            html: htmlToSend,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error(`Error sending confirmation email: ${err}`);
            } else {
                logger.info(`Confirmation email sent to : ${user.email}`);
            }
        });

        logger.info(`Password has been reset for user: ${user.username}`);
        res.status(200).json({
            success: "true",
            message:
                "Password has been reset and a confirmation email has been sent.",
        });
    } catch (error) {
        logger.error(`Error resetting password: ${error.message}`);

        res.status(500).json({
            success: "false",
            message: error.message,
        });
    }
};
