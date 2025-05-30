import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtInterceptor } from './interceptors/jwt.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new JwtInterceptor());

  console.log(`YASMA started listening on port ${process.env.PORT}`);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
