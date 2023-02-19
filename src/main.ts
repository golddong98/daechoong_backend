import { NestFactory } from '@nestjs/core';
import { AppModule } from './resource/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('NODE_SERVER_PORT');
  app.enableCors({
    origin: true,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  await app.listen(port);
}

bootstrap();

// doyeon
