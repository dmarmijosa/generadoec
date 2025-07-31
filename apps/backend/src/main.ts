import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  // Habilitar CORS para desarrollo
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Configurar puerto
  const port = process.env.PORT || 3001;

  await app.listen(port);
  console.log(`🚀 Backend ejecutándose en http://localhost:${port}`);
}
void bootstrap();
