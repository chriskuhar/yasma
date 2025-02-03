import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisService } from './redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors();
  //await app.listen(process.env.PORT ?? 3001);
  await app.listen(3001);
}
bootstrap();
