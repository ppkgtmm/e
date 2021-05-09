import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter, exceptionFactory } from './exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory,
    }),
  );
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(3000);
}
bootstrap();
