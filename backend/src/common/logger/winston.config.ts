// common/logger/winston.config.ts
import * as winston from 'winston';

export const winstonConfig = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
    }),
    new winston.transports.Console(),
  ],
});
