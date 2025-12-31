import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import * as path from 'path';

@Injectable()
export class AppLogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: [
        new transports.File({
          filename: path.join(process.cwd(), 'logs/error.log'),
        }),
      ],
    });
  }

  error(message: string, meta?: unknown) {
    this.logger.error(message, meta);
  }

  log(message: string, meta?: unknown) {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: unknown) {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta?: unknown) {
    this.logger.verbose(message, meta);
  }
}
