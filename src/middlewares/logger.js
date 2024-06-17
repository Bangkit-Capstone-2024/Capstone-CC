// logger.js
//const { createLogger, format, transports } = require('winston');
//const { combine, timestamp, printf, colorize } = format;
const path = require('path');
import winston from "winston";

import moment from "moment-timezone";

const timezoned = () => {
  return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: timezoned }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level} : ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('/var/log/prod-momee', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('/var/log/prod-momee', 'combined.log') }),
  ],
});

module.exports = logger;
