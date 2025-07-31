import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('GeneradorEC API')
    .setDescription(
      'API para generar datos ecuatorianos válidos para desarrollo y testing',
    )
    .setVersion('1.0.0')
    .setContact(
      'Danny Armijos',
      'https://www.danny-armijos.com/',
      'support-client@dmarmijosa.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Servidor Local')
    .addServer('https://generadorec.dmarmijosa.com', 'Servidor Producción')
    .addTag('generator', 'Endpoints para generación de datos ecuatorianos')
    .addTag('health', 'Endpoints de estado y salud del servicio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'GeneradorEC API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

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
  console.log(
    `📚 Documentación API disponible en http://localhost:${port}/api/docs`,
  );
  console.log(`📦 Entorno: ${nodeEnv}`);
  console.log(`🌐 CORS habilitado para: ${corsOrigins.join(', ')}`);
}

void bootstrap();
