import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppLogger } from '../logger/logger.service';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const ex = exception as { code?: unknown; meta?: { modelName?: unknown } };

    // ЛОГИРУЕМ ОДИН РАЗ — если объект похож на Prisma ошибку
    if (ex && typeof ex.code === 'string') {
      this.logger.error('Prisma error', {
        code: ex.code,
        model: ex.meta?.modelName,
        path: request.url,
      });

      if (ex.code === 'P2002') {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'Resource already exists',
            path: request.url,
            timestamp: new Date().toISOString(),
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        path: request.url,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
