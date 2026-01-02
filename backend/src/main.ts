import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppLogger } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLogger);

  app.useGlobalFilters(
    new PrismaExceptionFilter(logger),
    new HttpExceptionFilter(logger),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`Application started on http://localhost:${port}`);
}

void bootstrap();
