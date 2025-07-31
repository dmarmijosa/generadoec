import { Injectable } from '@nestjs/common';
import {
  PROVINCES,
  MALE_NAMES,
  FEMALE_NAMES,
  SURNAMES,
  PROFESSIONS,
  PHONE_PREFIXES,
  STREET_NAMES,
  COMPANY_NAMES,
  COMPANY_SUFFIXES,
  EMAIL_DOMAINS,
} from '../data/ecuadorian-data';
import { CedulaUtils } from '../utils/cedula.utils';

export interface GeneratedPerson {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  canton: string;
  fechaNacimiento: string;
  genero: 'M' | 'F';
  profesion: string;
  ruc?: string;
  empresa?: string;
}

export interface GenerationOptions {
  quantity: number;
  includeRUC?: boolean;
  includeCompany?: boolean;
  province?: string;
  ageRange?: {
    min: number;
    max: number;
  };
}

@Injectable()
export class DataGeneratorService {
  /**
   * Genera datos de personas ecuatorianas
   */
  generatePeople(options: GenerationOptions): GeneratedPerson[] {
    const results: GeneratedPerson[] = [];

    for (let i = 0; i < options.quantity; i++) {
      const person = this.generateSinglePerson(options);
      results.push(person);
    }

    return results;
  }

  /**
   * Genera una sola persona
   */
  private generateSinglePerson(options: GenerationOptions): GeneratedPerson {
    // Seleccionar provincia
    const province = options.province
      ? PROVINCES.find(
          (p) => p.code === options.province || p.name === options.province,
        )
      : this.getRandomProvince();

    if (!province) {
      throw new Error('Provincia no válida');
    }

    // Generar género
    const genero = Math.random() < 0.5 ? 'M' : 'F';

    // Generar nombres
    const nombre = this.getRandomName(genero);
    const apellido = this.getRandomSurname();

    // Generar cédula
    const cedula = CedulaUtils.generateValidCedula(province.code);

    // Generar fecha de nacimiento
    const fechaNacimiento = this.generateBirthDate(options.ageRange);

    // Generar datos de contacto
    const email = this.generateEmail(nombre, apellido);
    const telefono = this.generatePhoneNumber(province.code);

    // Generar dirección
    const canton = this.getRandomCanton(province);
    const direccion = this.generateAddress();

    // Generar profesión
    const profesion = this.getRandomProfession();

    const person: GeneratedPerson = {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      provincia: province.name,
      canton,
      fechaNacimiento,
      genero,
      profesion,
    };

    // Agregar RUC si se solicita
    if (options.includeRUC) {
      person.ruc = CedulaUtils.generateRUCFromCedula(cedula);
    }

    // Agregar empresa si se solicita
    if (options.includeCompany) {
      person.empresa = this.generateCompanyName();
    }

    return person;
  }

  /**
   * Obtiene una provincia aleatoria
   */
  private getRandomProvince() {
    return PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
  }

  /**
   * Obtiene un nombre aleatorio según el género
   */
  private getRandomName(genero: 'M' | 'F'): string {
    const names = genero === 'M' ? MALE_NAMES : FEMALE_NAMES;
    return names[Math.floor(Math.random() * names.length)];
  }

  /**
   * Obtiene un apellido aleatorio
   */
  private getRandomSurname(): string {
    const firstSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const secondSurname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    return `${firstSurname} ${secondSurname}`;
  }

  /**
   * Genera una fecha de nacimiento realista
   */
  private generateBirthDate(ageRange?: { min: number; max: number }): string {
    const currentYear = new Date().getFullYear();
    const minAge = ageRange?.min || 18;
    const maxAge = ageRange?.max || 65;

    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = currentYear - age;

    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // Usar 28 para evitar problemas con febrero

    return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  /**
   * Genera un email realista
   */
  private generateEmail(nombre: string, apellido: string): string {
    const cleanNombre = this.cleanString(nombre);
    const cleanApellido = this.cleanString(apellido.split(' ')[0]); // Solo primer apellido
    const domain =
      EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

    const patterns = [
      `${cleanNombre}.${cleanApellido}`,
      `${cleanNombre}${cleanApellido}`,
      `${cleanNombre}_${cleanApellido}`,
      `${cleanNombre}${Math.floor(Math.random() * 999)}`,
      `${cleanApellido}${cleanNombre}`,
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return `${pattern}@${domain}`.toLowerCase();
  }

  /**
   * Genera un número de teléfono ecuatoriano
   */
  private generatePhoneNumber(provinceCode: string): string {
    const isMobile = Math.random() < 0.7; // 70% móviles, 30% fijos

    if (isMobile) {
      const prefix =
        PHONE_PREFIXES.mobile[
          Math.floor(Math.random() * PHONE_PREFIXES.mobile.length)
        ];
      const number = this.generateRandomDigits(7);
      return `+593 ${prefix} ${number.substring(0, 3)} ${number.substring(3)}`;
    } else {
      const landlinePrefixes = PHONE_PREFIXES.landline[provinceCode];
      if (landlinePrefixes && landlinePrefixes.length > 0) {
        const prefix =
          landlinePrefixes[Math.floor(Math.random() * landlinePrefixes.length)];
        const number = this.generateRandomDigits(7);
        return `+593 ${prefix} ${number.substring(0, 3)} ${number.substring(3)}`;
      } else {
        // Fallback a móvil si no hay prefijos de línea fija
        const prefix =
          PHONE_PREFIXES.mobile[
            Math.floor(Math.random() * PHONE_PREFIXES.mobile.length)
          ];
        const number = this.generateRandomDigits(7);
        return `+593 ${prefix} ${number.substring(0, 3)} ${number.substring(3)}`;
      }
    }
  }

  /**
   * Obtiene un cantón aleatorio de una provincia
   */
  private getRandomCanton(province: any): string {
    return province.cantons[
      Math.floor(Math.random() * province.cantons.length)
    ];
  }

  /**
   * Genera una dirección realista
   */
  private generateAddress(): string {
    const street =
      STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
    const number = Math.floor(Math.random() * 9999) + 1;
    const apartment =
      Math.random() < 0.3 ? ` Apt. ${Math.floor(Math.random() * 20) + 1}` : '';

    return `${street} N${number}${apartment}`;
  }

  /**
   * Obtiene una profesión aleatoria
   */
  private getRandomProfession(): string {
    return PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
  }

  /**
   * Genera un nombre de empresa
   */
  private generateCompanyName(): string {
    const name =
      COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
    const suffix =
      COMPANY_SUFFIXES[Math.floor(Math.random() * COMPANY_SUFFIXES.length)];
    const activity = [
      'Comercial',
      'Industrial',
      'Servicios',
      'Tecnológica',
      'Constructora',
    ][Math.floor(Math.random() * 5)];

    return `${activity} ${name} ${suffix}`;
  }

  /**
   * Limpia una cadena de caracteres especiales
   */
  private cleanString(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-zA-Z0-9]/g, ''); // Remover caracteres especiales
  }

  /**
   * Genera dígitos aleatorios
   */
  private generateRandomDigits(count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  /**
   * Genera datos de empresa específicos
   */
  generateCompanyData(options: GenerationOptions): any[] {
    const results: any[] = [];

    for (let i = 0; i < options.quantity; i++) {
      const province = options.province
        ? PROVINCES.find(
            (p) => p.code === options.province || p.name === options.province,
          )
        : this.getRandomProvince();

      if (!province) continue;

      const companyName = this.generateCompanyName();
      const ruc = CedulaUtils.generateCompanyRUC(province.code);
      const address = this.generateAddress();
      const phone = this.generatePhoneNumber(province.code);
      const email = this.generateCompanyEmail(companyName);

      results.push({
        nombre: companyName,
        ruc,
        direccion: address,
        provincia: province.name,
        canton: this.getRandomCanton(province),
        telefono: phone,
        email,
        tipoEmpresa: 'Sociedad Anónima',
      });
    }

    return results;
  }

  /**
   * Genera email de empresa
   */
  private generateCompanyEmail(companyName: string): string {
    const cleanName = this.cleanString(companyName.split(' ')[0]).toLowerCase();
    const domains = ['com.ec', 'ec', 'net.ec', 'org.ec'];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `info@${cleanName}.${domain}`;
  }
}
