import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLogger } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // получаем Winston-логгер из DI
  const logger = app.get(AppLogger);

  // глобальные фильтры ошибок
  app.useGlobalFilters(
    new PrismaExceptionFilter(logger),
    new HttpExceptionFilter(logger),
  );

  // глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  logger.log(`🚀 Application started on http://localhost:${port}`);
}

void bootstrap();
