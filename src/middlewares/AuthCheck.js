import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import env from "dotenv";
env.config();

export const authCheck = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"];

    if (!token) {
      res.status(401).json({
        success: "false",
        message: "Login first to get tokens",
      });
      return;
    }

    const decToken = await CryptoJS.AES.decrypt(token.split(" ")[1], process.env.API_SECRET).toString(CryptoJS.enc.Utf8);

    const verify = await jwt.verify(decToken, process.env.API_SECRET);

    if (!verify) {
      res.status(401).json({
        success: "false",
        message: "",
      });
      return;
    }

    if (verify.exp < Date.now() / 1000) {
      res.status(401).json({
        success: "false",
        message: "Token expired",
      });
      return;
    }

    req.user = verify;

    next();
  } catch (error) {
    res.status(401).json({
      success: "false",
      message: "Invalid Token",
    });
  }
};

module.exports = authCheck;
