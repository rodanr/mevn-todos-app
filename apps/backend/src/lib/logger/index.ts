import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../../config';

const logDir = 'logs';

// Define log formats
const formats = {
  console: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, ...meta }) =>
        `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`,
    ),
  ),
  file: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
};

// Configure transport for daily rotate file
const fileRotateTransport = new DailyRotateFile({
  dirname: logDir,
  filename: '%DATE%-app.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  format: formats.file,
});

// Create the logger instance
const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  transports: [
    // Always write to rotating file
    fileRotateTransport,
    // Write to console in non-production environments
    ...(config.env !== 'production'
      ? [
          new winston.transports.Console({
            format: formats.console,
          }),
        ]
      : []),
  ],
});

// Create a stream for Morgan
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
