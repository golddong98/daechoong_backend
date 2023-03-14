import { NestFactory } from '@nestjs/core';
import { AppModule } from './resource/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('NODE_SERVER_PORT');
  app.enableCors({
    origin: '*',
    methods: ['GET,POST,PUT,DELETE'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    maxAge: 3600,
  });
  await app.listen(port);
}

bootstrap();

// doyeon
