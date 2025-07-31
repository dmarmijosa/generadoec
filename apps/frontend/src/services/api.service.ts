import { config, logConfig } from "../config/config";

// Log de configuración al importar (solo en desarrollo)
logConfig();

const API_BASE_URL = config.apiUrl;

export interface GeneratedData {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  canton: string;
  fechaNacimiento: string;
  genero: string;
  profesion: string;
  ruc?: string;
  empresa?: string;
}

export interface GenerationOptions {
  quantity: number;
  includeRuc?: boolean;
  includeCompany?: boolean;
  provinceFilter?: string;
  genderFilter?: "M" | "F";
}

export interface Province {
  code: string;
  name: string;
  cantons: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  timestamp: string;
  error?: string;
}

class ApiService {
  private baseUrl = API_BASE_URL;

  /**
   * Genera datos de personas ecuatorianas
   */
  async generatePeople(options: GenerationOptions): Promise<GeneratedData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generator/people`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<GeneratedData[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al generar datos");
      }

      return result.data;
    } catch (error) {
      console.error("Error al generar datos:", error);
      throw error;
    }
  }

  /**
   * Genera datos de empresas ecuatorianas
   */
  async generateCompanies(
    options: GenerationOptions
  ): Promise<GeneratedData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generator/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<GeneratedData[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al generar datos de empresas");
      }

      return result.data;
    } catch (error) {
      console.error("Error al generar datos de empresas:", error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de provincias ecuatorianas
   */
  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generator/provinces`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Province[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al obtener provincias");
      }

      return result.data;
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      throw error;
    }
  }

  /**
   * Genera datos rápidos para la página principal
   */
  async getQuickData(quantity: number = 5): Promise<GeneratedData[]> {
    try {
      const params = new URLSearchParams({
        quantity: quantity.toString(),
      });

      const response = await fetch(`${this.baseUrl}/generator/quick?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<GeneratedData[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al obtener datos rápidos");
      }

      return result.data;
    } catch (error) {
      console.error("Error al obtener datos rápidos:", error);
      throw error;
    }
  }

  /**
   * Verifica el estado del servicio
   */
  async checkHealth(): Promise<{
    status: string;
    service: string;
    version: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/generator/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error || "Error al verificar estado del servicio"
        );
      }

      return result;
    } catch (error) {
      console.error("Error al verificar estado:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas del generador
   */
  async getStats(): Promise<{
    totalGenerated: number;
    lastGeneration: string;
    serverUptime: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/generator/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al obtener estadísticas");
      }

      return result.data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }

  /**
   * Valida una cédula ecuatoriana
   */
  async validateCedula(
    cedula: string
  ): Promise<{ valid: boolean; reason?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/generator/validate-cedula`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cedula }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al validar cédula");
      }

      return result.data;
    } catch (error) {
      console.error("Error al validar cédula:", error);
      throw error;
    }
  }
}

// Crear y exportar instancia singleton
const apiService = new ApiService();

export { apiService };
export default apiService;
