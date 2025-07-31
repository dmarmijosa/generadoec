/**
 * Configuración dinámica basada en variables de entorno
 */

// Interfaz para las variables de entorno del window
interface WindowEnv {
  [key: string]: string;
}

// Extender la interfaz Window
declare global {
  interface Window {
    __ENV__?: WindowEnv;
  }
}

// Función para obtener variables de entorno en tiempo de ejecución
const getEnvVar = (name: string, defaultValue: string = ""): string => {
  // En desarrollo (Vite)
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[name] || defaultValue;
  }

  // En producción o fallback
  if (typeof window !== "undefined" && window.__ENV__) {
    return window.__ENV__[name] || defaultValue;
  }

  return defaultValue;
};

// Detectar si estamos en producción
const isProduction = getEnvVar("NODE_ENV", "development") === "production";

// Configuración dinámica
export const config = {
  // Configuración del entorno
  production: isProduction,

  // URL de la API - se adapta automáticamente al entorno
  apiUrl: getEnvVar(
    "VITE_API_URL",
    isProduction ? "/api" : "http://localhost:3000/api"
  ),

  // Puerto del servidor
  port: parseInt(getEnvVar("PORT", "3000"), 10),

  // Dominio y URLs
  domain: getEnvVar("DOMAIN", "generadorec.dmarmijosa.com"),
  baseUrl: getEnvVar(
    "BASE_URL",
    isProduction
      ? "https://generadorec.dmarmijosa.com"
      : "http://localhost:3000"
  ),

  // Información de contacto
  supportEmail: getEnvVar("SUPPORT_EMAIL", "support-client@dmarmijosa.com"),

  // Información del autor
  author: {
    name: getEnvVar("AUTHOR_NAME", "Danny Armijos"),
    linkedin: getEnvVar(
      "AUTHOR_LINKEDIN",
      "https://www.linkedin.com/in/dmarmijosa/"
    ),
    website: getEnvVar("AUTHOR_WEBSITE", "https://www.danny-armijos.com/"),
    buyMeACoffee: getEnvVar("AUTHOR_COFFEE", "https://coff.ee/dmarmijosa"),
  },

  // Configuración de colores de Ecuador
  colors: {
    yellow: "#FFDD00",
    blue: "#034EA2",
    red: "#EE1C25",
  },

  // Configuración de la aplicación
  app: {
    name: getEnvVar("APP_NAME", "GeneradorEC"),
    version: getEnvVar("APP_VERSION", "1.0.0"),
    description: getEnvVar(
      "APP_DESCRIPTION",
      "Generador de datos ecuatorianos válidos para desarrollo y testing"
    ),
  },
};

// Función para logging de configuración (solo en desarrollo)
export const logConfig = () => {
  if (!config.production) {
    console.log("🔧 Configuración de la aplicación:", {
      production: config.production,
      apiUrl: config.apiUrl,
      port: config.port,
      baseUrl: config.baseUrl,
    });
  }
};

export default config;
