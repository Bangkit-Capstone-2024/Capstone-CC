// const TokensBlacklistModels = require("../models/Models").TokensBlacklistModels;
import { TokensBlacklistModels } from "../models/Models";

const CheckBlacklist = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, token not found",
    });
  }

  const blacklistedToken = await TokensBlacklistModels.findUnique({
    where: {
      token: token,
    },
  });

  if (blacklistedToken) {
    return res.status(401).json({
      success: false,
      message: "Access denied, token blacklisted",
    });
  }

  next();
};

module.exports = CheckBlacklist;
