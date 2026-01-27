import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(process.cwd(), 'logs');
const errorDir = path.join(logDir, 'error');

fs.mkdirSync(errorDir, { recursive: true });

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
    ),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(errorDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combinedlog.log'),
    }),
  ],
});
