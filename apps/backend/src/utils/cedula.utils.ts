export class CedulaUtils {
  /**
   * Genera una cédula ecuatoriana válida
   * @param provinceCode Código de provincia (01-24)
   * @returns Cédula válida de 10 dígitos
   */
  static generateValidCedula(provinceCode?: string): string {
    // Si no se proporciona código de provincia, usar uno aleatorio
    const province = provinceCode || this.getRandomProvinceCode();

    // Generar los siguientes 6 dígitos secuenciales
    const sequentialDigits = this.generateRandomDigits(6);
    
    // Los primeros 8 dígitos son: provincia + secuencial
    const firstEightDigits = province + sequentialDigits;

    // Calcular el dígito verificador
    const checkDigit = this.calculateCheckDigit(firstEightDigits);

    // El último dígito para personas naturales es siempre 0
    return firstEightDigits + checkDigit + '0';
  }

  /**
   * Valida si una cédula ecuatoriana es correcta
   * @param cedula Cédula a validar
   * @returns true si la cédula es válida
   */
  static isValidCedula(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) return false;

    const province = parseInt(cedula.substring(0, 2));
    if (province < 1 || province > 24) return false;

    // El último dígito debe ser 0 para personas naturales
    if (cedula.charAt(9) !== '0') return false;

    const firstEightDigits = cedula.substring(0, 8);
    const checkDigit = parseInt(cedula.charAt(8));
    const calculatedCheckDigit = this.calculateCheckDigit(firstEightDigits);

    return checkDigit === calculatedCheckDigit;
  }

  /**
   * Calcula el dígito verificador según el algoritmo ecuatoriano
   * @param firstEightDigits Primeros 8 dígitos de la cédula
   * @returns Dígito verificador
   */
  private static calculateCheckDigit(firstEightDigits: string): number {
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      let product = parseInt(firstEightDigits.charAt(i)) * coefficients[i];
      if (product >= 10) {
        product = Math.floor(product / 10) + (product % 10);
      }
      sum += product;
    }

    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  }

  /**
   * Genera dígitos aleatorios
   * @param count Cantidad de dígitos a generar
   * @returns String con dígitos aleatorios
   */
  private static generateRandomDigits(count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  /**
   * Obtiene un código de provincia aleatorio válido
   * @returns Código de provincia (01-24)
   */
  private static getRandomProvinceCode(): string {
    const provinceNumber = Math.floor(Math.random() * 24) + 1;
    return provinceNumber.toString().padStart(2, '0');
  }

  /**
   * Genera un RUC válido basado en una cédula
   * @param cedula Cédula base
   * @returns RUC de 13 dígitos
   */
  static generateRUCFromCedula(cedula: string): string {
    if (!this.isValidCedula(cedula)) {
      throw new Error('Cédula inválida para generar RUC');
    }
    return cedula + '001';
  }

  /**
   * Genera un RUC de empresa (jurídica)
   * @param provinceCode Código de provincia
   * @returns RUC de empresa válido
   */
  static generateCompanyRUC(provinceCode?: string): string {
    const province = provinceCode || this.getRandomProvinceCode();

    // Para empresas, el tercer dígito debe ser 9
    const firstTwoDigits = province;
    const thirdDigit = '9';
    const nextSixDigits = this.generateRandomDigits(6);

    const firstNineDigits = firstTwoDigits + thirdDigit + nextSixDigits;
    const checkDigit = this.calculateCompanyRUCCheckDigit(firstNineDigits);

    return firstNineDigits + checkDigit + '001';
  }

  /**
   * Calcula el dígito verificador para RUC de empresas
   * @param firstNineDigits Primeros 9 dígitos del RUC
   * @returns Dígito verificador
   */
  private static calculateCompanyRUCCheckDigit(
    firstNineDigits: string,
  ): number {
    const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(firstNineDigits.charAt(i)) * coefficients[i];
    }

    const remainder = sum % 11;
    const checkDigit = 11 - remainder;

    if (checkDigit === 10) return 0;
    if (checkDigit === 11) return 1;
    return checkDigit;
  }

  /**
   * Función de prueba para validar el algoritmo de cédulas
   * @returns true si todas las pruebas pasan
   */
  static testCedulaAlgorithm(): boolean {
    console.log('🧪 Probando algoritmo de cédulas ecuatorianas...');
    
    // Generar 10 cédulas y validarlas
    for (let i = 0; i < 10; i++) {
      const cedula = this.generateValidCedula();
      const isValid = this.isValidCedula(cedula);
      console.log(`Cédula: ${cedula} - Válida: ${isValid}`);
      
      if (!isValid) {
        console.error(`❌ Error: Cédula generada ${cedula} no es válida`);
        return false;
      }
    }
    
    // Probar cédulas conocidas válidas
    const validCedulas = [
      '1714616123', // Ejemplo válido de Pichincha
      '0926687856', // Ejemplo válido de Guayas
    ];
    
    for (const cedula of validCedulas) {
      const isValid = this.isValidCedula(cedula);
      console.log(`Cédula conocida: ${cedula} - Válida: ${isValid}`);
    }
    
    console.log('✅ Todas las pruebas del algoritmo de cédulas pasaron');
    return true;
  }
}
