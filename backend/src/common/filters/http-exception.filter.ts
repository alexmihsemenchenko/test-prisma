import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppLogger } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as {
        message?: string | string[];
      };

      if (status >= 500) {
        this.logger.error('HTTP Exception', {
          status,
          path: request.url,
          exception: exceptionResponse,
        });
      } else {
        this.logger.warn('HTTP Exception', {
          status,
          path: request.url,
          exception: exceptionResponse,
        });
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exceptionResponse?.message ?? 'Unexpected error',
      });
      return;
    }

    // Non-HTTP exceptions
    this.logger.error('Unhandled Exception', {
      exception: String(exception),
      path: request.url,
    });

    response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    });
  }
}
