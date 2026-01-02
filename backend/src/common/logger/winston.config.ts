import * as winston from 'winston';

/**
 * Фильтр: пропускаем ТОЛЬКО level === 'info'
 * Всё остальное (error, warn, etc) — отбрасываем
 */
const successOnlyFilter = winston.format((info) => {
  return info.level === 'info' ? info : false;
});

export const winstonLogger = winston.createLogger({
  /**
   * Базовый уровень.
   * Ниже него логгер не опустится.
   */
  level: 'info',

  /**
   * Общий формат
   */
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  /**
   * Transports
   */
  transports: [
    /**
     * ❌ Только ошибки
     */
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    /**
     * ✅ Только успешные (info)
     */
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: successOnlyFilter(),
    }),

    /**
     * 🖥 Консоль — для разработки
     */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

/**
 * ❌ Uncaught exceptions
 */
winstonLogger.exceptions.handle(
  new winston.transports.File({
    filename: 'logs/exceptions.log',
  }),
);

/**
 * ❌ Unhandled promise rejections
 */
winstonLogger.rejections.handle(
  new winston.transports.File({
    filename: 'logs/rejections.log',
  }),
);
