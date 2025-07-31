import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppService } from './app.service';
import { GeneratorController } from './controllers/generator.controller';
import { DataGeneratorService } from './services/data-generator.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'frontend', 'dist'),
    }),
  ],
  controllers: [GeneratorController],
  providers: [AppService, DataGeneratorService],
})
export class AppModule {}
