// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join('/var/log/dev-momee', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join('/var/log/dev-momee', 'combined.log') }),
  ],
});

module.exports = logger;
