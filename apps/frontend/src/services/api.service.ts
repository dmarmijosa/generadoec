import { config, logConfig } from '../config/config';

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
  includeRUC?: boolean;
  includeCompany?: boolean;
  province?: string;
  ageRange?: {
    min: number;
    max: number;
  };
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
      const response = await fetch(`${this.baseUrl}/api/generator/people`, {
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
  async generateCompanies(options: GenerationOptions) {
    try {
      const response = await fetch(`${this.baseUrl}/api/generator/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

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
   * Obtiene la lista de provincias disponibles
   */
  async getProvinces() {
    try {
      const response = await fetch(`${this.baseUrl}/api/generator/provinces`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

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
   * Genera datos rápidamente (para ejemplo automático)
   */
  async generateQuickData(
    quantity: number = 5,
    province?: string
  ): Promise<GeneratedData[]> {
    try {
      const params = new URLSearchParams();
      params.append("quantity", quantity.toString());
      if (province) {
        params.append("province", province);
      }

      const response = await fetch(
        `${this.baseUrl}/api/generator/quick?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<GeneratedData[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al generar datos rápidos");
      }

      return result.data;
    } catch (error) {
      console.error("Error al generar datos rápidos:", error);
      // En caso de error, retornar datos mock para no romper la UI
      return this.getMockData(quantity);
    }
  }

  /**
   * Verifica el estado del backend
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/api/generator/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error al verificar el estado del backend:", error);
      return false;
    }
  }

  /**
   * Datos mock para desarrollo y fallback
   */
  private getMockData(quantity: number): GeneratedData[] {
    const mockData: GeneratedData[] = [];
    const nombres = [
      "María",
      "José",
      "Ana",
      "Carlos",
      "Luis",
      "Carmen",
      "Jorge",
      "Patricia",
    ];
    const apellidos = [
      "García",
      "López",
      "Martínez",
      "Rodríguez",
      "Pérez",
      "González",
    ];
    const provincias = ["Pichincha", "Guayas", "Azuay", "Manabí", "El Oro"];
    const cantones = ["Quito", "Guayaquil", "Cuenca", "Portoviejo", "Machala"];

    for (let i = 0; i < quantity; i++) {
      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
      const provincia =
        provincias[Math.floor(Math.random() * provincias.length)];

      mockData.push({
        cedula: `17${Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, "0")}`,
        nombre,
        apellido: `${apellido} ${
          apellidos[Math.floor(Math.random() * apellidos.length)]
        }`,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@example.com`,
        telefono: `+593 98 ${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")} ${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        direccion: `Av. Principal ${Math.floor(Math.random() * 9999) + 1}`,
        provincia,
        canton: cantones[Math.floor(Math.random() * cantones.length)],
        fechaNacimiento: `199${Math.floor(Math.random() * 10)}-${(
          Math.floor(Math.random() * 12) + 1
        )
          .toString()
          .padStart(2, "0")}-${(Math.floor(Math.random() * 28) + 1)
          .toString()
          .padStart(2, "0")}`,
        genero: Math.random() < 0.5 ? "M" : "F",
        profesion: "Ingeniero",
      });
    }

    return mockData;
  }
}

export const apiService = new ApiService();
