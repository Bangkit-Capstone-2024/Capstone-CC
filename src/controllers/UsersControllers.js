const salt = bcryptjs.genSaltSync(10);
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import env from "dotenv";
import { UsersModels } from "../models/Models";

env.config();

// CREATE USERS

export const UsersCreate = async (req, res) => {
  try {
    const { email, password, username } = await req.body;

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
        password: bcryptjs.hashSync(password, salt),
        username: username,
      },
    });

    // CREATE TOKEN
    const token = await jwt.sign(
      {
        app_name: process.env.APP_NAME,
        id: createUsers.id,
        email: createUsers.email,
        username: createUsers.username,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const hashToken = await CryptoJS.AES.encrypt(token, process.env.API_SECRET).toString();

    res.status(201).json({
      success: "true",
      message: "User created Successfully",
      data: {
        id: createUsers.id,
        email: createUsers.email,
        username: createUsers.username,
        token: `${hashToken}`,
      },
    });
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
    const data = await req.body;
    const { id } = await req.params;

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

    // CHECK UNIQUE USERNAME

    const checkUniqueUsername = await UsersModels.findUnique({
      where: {
        id: parseInt(id),
        username: data.username,
      },
    });
    if (checkUniqueUsername) {
      return res.status(401).json({
        success: "false",
        message: "Username already exists",
      });
    }

    let updatedData = {
      username: data.username,
    };

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
      message: "User updated Successfully!",
      data: {
        id: parseInt(id),
        email: data.email,
        username: data.username,
      },
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
