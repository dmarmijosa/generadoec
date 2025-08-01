import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import type { Response } from 'express';
import { AppService } from './app.service';
import { GeneratorController } from './controllers/generator.controller';
import { DataGeneratorService } from './services/data-generator.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'frontend', 'dist'),
      serveStaticOptions: {
        cacheControl: false,
        setHeaders: (res: Response) => {
          // Disable caching for all static files
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        },
      },
    }),
  ],
  controllers: [GeneratorController],
  providers: [AppService, DataGeneratorService],
})
export class AppModule {}
