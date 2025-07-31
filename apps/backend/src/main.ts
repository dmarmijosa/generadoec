import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  // Configurar CORS con variables de entorno
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Configurar puerto desde variables de entorno
  const port = parseInt(process.env.PORT || '3000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

  await app.listen(port);

  console.log(`🚀 Backend ejecutándose en http://localhost:${port}`);
  console.log(`📦 Entorno: ${nodeEnv}`);
  console.log(`🌐 CORS habilitado para: ${corsOrigins.join(', ')}`);
}

void bootstrap();
