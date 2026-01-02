import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { winstonLogger } from './winston.config';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: unknown, meta?: Record<string, unknown>) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    let entry: winston.LogEntry;
    if (meta && typeof meta === 'object') {
      entry = { level: 'info', message: msg, ...meta };
    } else {
      entry = { level: 'info', message: msg };
    }
    winstonLogger.log(entry);
  }

  error(message: unknown, meta?: Record<string, unknown>) {
    // helper: plain object check
    const isPlainObject = (v: unknown): v is Record<string, unknown> =>
      typeof v === 'object' && v !== null && !Array.isArray(v);

    let msg = '';
    const entry: winston.LogEntry & Record<string, unknown> = {
      level: 'error',
      message: '',
    };

    if (message instanceof Error) {
      msg = message.message;
      entry.stack = message.stack;
    } else {
      msg = typeof message === 'string' ? message : JSON.stringify(message);
    }

    // Safely copy allowed meta properties (avoid unsafe any assignments)
    if (isPlainObject(meta)) {
      for (const [k, v] of Object.entries(meta)) {
        if (v === null) {
          entry[k] = null;
          continue;
        }

        const t = typeof v;
        if (t === 'string' || t === 'number' || t === 'boolean') {
          entry[k] = v;
          continue;
        }

        if (v instanceof Error) {
          // preserve error message and stack
          entry[k] = { message: v.message };
          if (!entry.stack && v.stack) entry.stack = v.stack;
          continue;
        }

        if (isPlainObject(v)) {
          // shallow copy safe objects
          entry[k] = v;
          // if this object looks like an error shape, extract stack
          const maybeStack = v['stack'];
          if (!entry.stack && typeof maybeStack === 'string')
            entry.stack = maybeStack;
          continue;
        }

        // otherwise skip functions, symbols, etc.
      }
    }

    entry.message = msg;
    winstonLogger.log(entry);
  }

  warn(message: unknown, meta?: Record<string, unknown>) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    let entry: winston.LogEntry;
    if (meta && typeof meta === 'object') {
      entry = { level: 'warn', message: msg, ...meta };
    } else {
      entry = { level: 'warn', message: msg };
    }
    winstonLogger.log(entry);
  }

  debug(message: unknown, meta?: Record<string, unknown>) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    let entry: winston.LogEntry;
    if (meta && typeof meta === 'object') {
      entry = { level: 'debug', message: msg, ...meta };
    } else {
      entry = { level: 'debug', message: msg };
    }
    winstonLogger.log(entry);
  }

  verbose(message: unknown, meta?: Record<string, unknown>) {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    let entry: winston.LogEntry;
    if (meta && typeof meta === 'object') {
      entry = { level: 'verbose', message: msg, ...meta };
    } else {
      entry = { level: 'verbose', message: msg };
    }
    winstonLogger.log(entry);
  }
}
