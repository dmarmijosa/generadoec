import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import {
  DataGeneratorService,
  GenerationOptions,
} from '../services/data-generator.service';

export class GenerateDataDto {
  quantity: number = 10;
  includeRUC?: boolean = false;
  includeCompany?: boolean = false;
  province?: string;
  ageRange?: {
    min: number;
    max: number;
  };
}

@Controller('generator')
export class GeneratorController {
  constructor(private readonly dataGeneratorService: DataGeneratorService) {}

  /**
   * Genera datos de personas ecuatorianas
   */
  @Post('people')
  generatePeople(@Body() options: GenerateDataDto) {
    try {
      const data = this.dataGeneratorService.generatePeople(options);
      return {
        success: true,
        data,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Genera datos de empresas ecuatorianas
   */
  @Post('companies')
  generateCompanies(@Body() options: GenerateDataDto) {
    try {
      const data = this.dataGeneratorService.generateCompanyData(options);
      return {
        success: true,
        data,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Obtiene información sobre las provincias disponibles
   */
  @Get('provinces')
  getProvinces() {
    // Importar aquí para evitar problemas de dependencias circulares
    const { PROVINCES } = require('../data/ecuadorian-data');

    return {
      success: true,
      data: PROVINCES.map((p) => ({
        code: p.code,
        name: p.name,
        cantons: p.cantons,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Endpoint para generar datos rápidamente (GET para facilidad de uso)
   */
  @Get('quick')
  generateQuickData(
    @Query('quantity') quantity?: string,
    @Query('province') province?: string,
  ) {
    try {
      const options: GenerationOptions = {
        quantity: quantity ? parseInt(quantity, 10) : 5,
        province,
      };

      // Validar cantidad
      if (options.quantity > 1000) {
        options.quantity = 1000;
      }
      if (options.quantity < 1) {
        options.quantity = 1;
      }

      const data = this.dataGeneratorService.generatePeople(options);

      return {
        success: true,
        data,
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Endpoint de salud para verificar que el servicio funciona
   */
  @Get('health')
  healthCheck() {
    return {
      success: true,
      status: 'OK',
      service: 'GeneradorEC Data Generator',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
