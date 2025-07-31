import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';
import {
  DataGeneratorService,
  GenerationOptions,
} from '../services/data-generator.service';
import { PROVINCES } from '../data/ecuadorian-data';

export class GenerateDataDto {
  @ApiProperty({
    description: 'Cantidad de registros a generar',
    minimum: 1,
    maximum: 1000,
    default: 10,
  })
  quantity: number = 10;

  @ApiProperty({
    description: 'Incluir RUC en los datos generados',
    required: false,
    default: false,
  })
  includeRUC?: boolean = false;

  @ApiProperty({
    description: 'Incluir datos de empresa',
    required: false,
    default: false,
  })
  includeCompany?: boolean = false;

  @ApiProperty({
    description: 'Filtrar por provincia específica',
    required: false,
  })
  province?: string;

  @ApiProperty({
    description: 'Rango de edad para generar datos',
    required: false,
    example: { min: 18, max: 65 },
  })
  ageRange?: {
    min: number;
    max: number;
  };
}

@ApiTags('generator')
@Controller('generator')
export class GeneratorController {
  constructor(private readonly dataGeneratorService: DataGeneratorService) {}

  /**
   * Genera datos de personas ecuatorianas
   */
  @ApiOperation({
    summary: 'Generar datos de personas ecuatorianas',
    description:
      'Genera datos ficticios de personas ecuatorianas con cédulas válidas, nombres, direcciones y más información realista.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos generados exitosamente',
    example: {
      success: true,
      data: [
        {
          cedula: '1724567890',
          nombre: 'María Elena',
          apellido: 'Rodríguez Vásquez',
          email: 'maria.rodriguez@example.com',
          telefono: '+593 98 123 4567',
          direccion: 'Av. República del Salvador N34-183',
          provincia: 'Pichincha',
          canton: 'Quito',
          fechaNacimiento: '1990-03-15',
          genero: 'F',
          profesion: 'Ingeniera',
        },
      ],
      count: 1,
      timestamp: '2025-07-31T02:17:29.054Z',
    },
  })
  @ApiBody({ type: GenerateDataDto })
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
  @ApiOperation({
    summary: 'Generar datos de empresas ecuatorianas',
    description:
      'Genera datos ficticios de empresas ecuatorianas con RUC válido, nombres comerciales realistas, direcciones y datos de contacto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos de empresas generados exitosamente',
    example: {
      success: true,
      data: [
        {
          ruc: '1791234567001',
          razonSocial: 'Comercial Andes S.A.',
          nombreComercial: 'Andes Store',
          email: 'info@andesstore.com.ec',
          telefono: '+593 2 246 8000',
          direccion: 'Av. Amazonas N39-123',
          provincia: 'Pichincha',
          canton: 'Quito',
          sector: 'Comercial',
          actividad: 'Venta al por menor',
        },
      ],
      count: 1,
      timestamp: '2025-07-31T02:17:29.054Z',
    },
  })
  @ApiBody({ type: GenerateDataDto })
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
   * Obtiene listado de provincias ecuatorianas
   */
  @ApiOperation({
    summary: 'Obtener provincias del Ecuador',
    description:
      'Devuelve el listado completo de provincias del Ecuador con sus respectivos cantones.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de provincias obtenido exitosamente',
    example: {
      success: true,
      data: [
        {
          code: '01',
          name: 'Azuay',
          cantons: ['Cuenca', 'Girón', 'Gualaceo', 'Nabón', 'Paute'],
        },
        {
          code: '17',
          name: 'Pichincha',
          cantons: ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Rumiñahui'],
        },
      ],
      count: 24,
      timestamp: '2025-07-31T02:17:29.054Z',
    },
  })
  @Get('provinces')
  getProvinces() {
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
  @ApiOperation({
    summary: 'Generar datos rápidos de muestra',
    description:
      'Genera una pequeña muestra de datos ecuatorianos para mostrar en la página principal.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos rápidos generados exitosamente',
    example: {
      success: true,
      data: {
        cedula: '1724567890',
        nombre: 'María Elena Rodríguez',
        email: 'maria.rodriguez@example.com',
        telefono: '+593 98 123 4567',
        empresa: 'Comercial Andes S.A.',
        ruc: '1791234567001',
      },
      timestamp: '2025-07-31T02:17:29.054Z',
    },
  })
  @ApiQuery({
    name: 'quantity',
    required: false,
    description: 'Cantidad de datos a generar',
    example: 5,
  })
  @ApiQuery({
    name: 'province',
    required: false,
    description: 'Filtrar por provincia específica',
    example: 'Pichincha',
  })
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
