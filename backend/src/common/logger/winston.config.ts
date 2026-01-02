import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  level: 'info', // ВАЖНО: иначе info не пишется
  format: winston.format.combine(
    winston.format.timestamp(),
    // include stack traces when logging Error objects
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    // только ошибки
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),

    // все уровни
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),

    // консоль для dev
    new winston.transports.Console(),
  ],
});

// Handle uncaught exceptions and unhandled promise rejections
winstonLogger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' }),
);
// Rejections (promises) — use `unknown` and runtime checks instead of `any`
type RejectionsHandler = { handle: (transport: unknown) => void };
const maybeRejectionsLogger = winstonLogger as unknown as Record<
  string,
  unknown
>;
const maybeRejectionsWinston = winston as unknown as Record<string, unknown>;
const rej1 = maybeRejectionsLogger['rejections'];
if (rej1 && typeof rej1 === 'object' && 'handle' in rej1) {
  const handler = rej1 as RejectionsHandler;
  if (typeof handler.handle === 'function') {
    handler.handle(
      new winston.transports.File({ filename: 'logs/rejections.log' }),
    );
  }
} else {
  const rej2 = maybeRejectionsWinston['rejections'];
  if (rej2 && typeof rej2 === 'object' && 'handle' in rej2) {
    const handler = rej2 as RejectionsHandler;
    if (typeof handler.handle === 'function') {
      handler.handle(
        new winston.transports.File({ filename: 'logs/rejections.log' }),
      );
    }
  }
}
