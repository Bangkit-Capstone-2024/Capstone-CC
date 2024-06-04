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
// const TokensBlacklistModels = require("../models/Models").tokenblacklist;

// import { transporter } from "../middlewares/NodeMailerConfig";

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
      return res.status(401).json({
        success: "false",
        message: "Email already exists",
      });
    }

    const createUsers = await UsersModels.create({
      data: {
        email: email,
        password: bcryptjs.hashSync(password, 10), // jangan lupa mendefinisikan salt dengan benar
        username: username,
      },
    });

    // CREATE TOKEN
    const token = jwt.sign(
      {
        app_id: process.env.APP_ID,
        id: createUsers.id,
        email: createUsers.email,
        username: createUsers.username,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const hashToken = CryptoJS.AES.encrypt(token, process.env.API_SECRET).toString();

    // Generate verification link
    const verificationLink = `${process.env.CLIENT_URL}/api/v1/users/verify-email/${createUsers.id}/${encodeURIComponent(hashToken)}`;

    // Read email template
    const templatePath = path.join(__dirname, "../emailTemplates", "verificationEmail.html");
    const template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholder with actual link
    let htmlToSend = template.replace(/{{username}}/g, username);
    htmlToSend = htmlToSend.replace(/{{email}}/g, email);
    htmlToSend = htmlToSend.replace(/{{verificationLink}}/g, verificationLink);

    // Send verification email
    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: createUsers.email,
      subject: "Email Verification for Your Momee.id Account",
      html: htmlToSend,
    });

    console.log(`Verification email sent to ${createUsers.email}`);

    // Set authentication cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(201).json({
      success: "true",
      message: "User created successfully. Please check your email to verify your account.",
      data: {
        id: createUsers.id,
        email: createUsers.email,
        username: createUsers.username,
      },
    });
    //Logging Kirim email verifikasi
    console.log(`User ${createUsers.username} created successfully. Email verification sent to ${createUsers.email}`);

    res.redirect('/homepage')
    
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
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

    const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(token), process.env.API_SECRET);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

    const decoded = jwt.verify(decryptedToken, process.env.API_SECRET);

    if (decoded.id !== parseInt(id, 10)) {
      return res.status(400).json({
        success: "false",
        message: "Invalid token or ID",
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
    const templatePath = path.join(__dirname, "../emailTemplates", "verifiedEmail.html");
    const template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholder with actual link
    let htmlToSend = template.replace(/{{username}}/g, user.username);
    htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);
    // htmlToSend = htmlToSend.replace(/{{verificationLink}}/g, verificationLink);

    // Send notification email
    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: user.email,
      subject: "Email Verified Successfully!",
      html: htmlToSend,
    });

    console.log(`Verification email send to ${user.email}`);

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
    console.log(`User ${user.username} verified successfully.`);
  } catch (error) {
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
    const token = jwt.sign(
      {
        app_name: process.env.APP_ID,
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const hashToken = CryptoJS.AES.encrypt(token, process.env.API_SECRET).toString();

    // Generate verification link
    const verificationLink = `${process.env.CLIENT_URL}/api/v1/users/verify-email/${user.id}/${encodeURIComponent(hashToken)}`;

    // Read email template
    const templatePath = path.join(__dirname, "../emailTemplates", "verificationEmail.html");
    const template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholder with actual link
    let htmlToSend = template.replace(/{{username}}/g, user.username);
    htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);
    htmlToSend = htmlToSend.replace(/{{verificationLink}}/g, verificationLink);

    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: user.email,
      subject: "Email Verification for Your Momee.id Account",
      html: htmlToSend,
    });

    res.status(200).json({
      success: "true",
      message: "Verification email resent successfully",
    });

    console.log(`Verification email resent to ${user.email} successfully`);
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
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
      return res.status(401).json({
        success: "false",
        message: "Email or Password Incorrect",
      });
    }

    const comparePassword = await bcryptjs.compareSync(password, Usercheck.password);

    if (!comparePassword) {
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

    const hashToken = await CryptoJS.AES.encrypt(token, process.env.API_SECRET).toString();

    res.setHeader("Access-Control-Allow-Origin", "*");

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
    });

    const conn = await UsersModels.count();

    res.status(200).json({
      success: "true",
      message: "List users",
      current_page: parseInt(page),
      total_page: Math.ceil(conn / limit),
      total_data: conn,
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: error.message,
    });
  }
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
      return res.status(404).json({
        success: "false",
        message: "User ID not found!",
      });
    }

    // CHECK UNIQUE USERNAME (if username is being changed)
    // if (data.username && data.username !== checkUniqueId.username) {
    //   const checkUniqueUsername = await UsersModels.findFirst({
    //     where: {
    //       username: data.username,
    //     },
    //   });

    //   if (checkUniqueUsername) {
    //     return res.status(401).json({
    //       success: "false",
    //       message: "Username already exists",
    //     });
    //   }
    // }

    let updatedData = {};

    if (data.username) {
      updatedData.username = data.username;
    }

    if (data.password) {
      const hashedPassword = await bcryptjs.hash(data.password, 10);
      updatedData.password = hashedPassword;
    }

    const result = await UsersModels.update({
      where: {
        id: parseInt(id),
      },
      data: updatedData,
    });

    res.status(201).json({
      success: "true",
      message: "User updated successfully!",
      data: {
        id: result.id,
        email: result.email,
        username: result.username,
      },
    });
  } catch (error) {
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
      //   data: {
      //     id: parseInt(id),
      //     email: data.email,
      //     username: data.username,
      //   },
    });
    console.log(`User ${checkId.username} deleted successfully`);
  } catch (error) {
    res.status(500).json({
      success: "false",
      error: error.message,
    });
  }
};

// USER Authorization

export const UsersAuth = async (req, res) => {
  try {
    const token = await req.headers.authorization;

    if (!token) {
      res.status(401).json({
        success: "false",
        message: "Login first to get tokens ?",
      });
      return res.status(401).json({
        success: "false",
        message: "Token not found",
      });
    }

    const baerer = await token.split(" ")[1];
    const decToken = await CryptoJS.AES.decrypt(baerer, process.env.API_SECRET).toString(CryptoJS.enc.Utf8);

    const verify = await jwt.verify(decToken, process.env.API_SECRET);

    if (!verify) {
      res.status(401).json({
        success: "false",
        message: "Login first to get tokens ?",
      });
      return res.status(401).json({
        success: "false",
        error: "Error token",
      });
    }

    if (verify.exp < Date.now() / 1000) {
      res.status(401).json({
        success: "false",
        message: "Token expired",
      });
      return res.status(401).json({
        success: "false",
        message: "Token expired",
      });
    }

    const getUserData = await UsersModels.findUnique({
      where: {
        id: parseInt(verify.id),
      },
    });

    const removePass = delete getUserData.password;

    return res.status(200).json({
      success: "true",
      message: "User data",
      query: getUserData,
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: error.message,
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
    const templatePath = path.join(__dirname, "../emailTemplates", "requestResetPassword.html");
    const template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholder with actual link
    let htmlToSend = template.replace(/{{username}}/g, user.username);
    htmlToSend = htmlToSend.replace(/{{email}}/g, user.email);
    htmlToSend = htmlToSend.replace(/{{resetPasswordLink}}/g, resetPasswordLink);

    const mailOptions = {
      from: process.env.ZOHO_EMAIL,
      to: user.email,
      subject: "Reset Password Request",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Error sending email: ${err}`);
        return res.status(500).json({
          success: "false",
          message: "Error sending email",
          error: err.message,
        });
      }

      console.log(`Reset Password send to ${user.email}`);
      res.status(200).json({
        success: "true",
        message: "Email sent to " + email + " with further instructions",
      });
    });
  } catch (error) {
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
    const templatePath = path.join(__dirname, "../emailTemplates", "confirmResetPassword.html");
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
        console.error("Error sending confirmation email:", err);
      } else {
        console.log("Confirmation email sent:" + email);
      }
    });

    res.status(200).json({
      success: "true",
      message: "Password has been reset and a confirmation email has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: "false",
      message: error.message,
    });
  }
};
