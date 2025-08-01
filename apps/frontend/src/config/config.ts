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

// Detectar si estamos en producción de manera más agresiva
const isProduction = 
  getEnvVar("NODE_ENV", "development") === "production" ||
  getEnvVar("VITE_NODE_ENV", "development") === "production" ||
  import.meta.env.PROD === true ||
  window.location.hostname !== "localhost" ||
  window.location.protocol === "https:";

// Obtener información de build
const buildInfo = {
  version: getEnvVar("VITE_APP_VERSION", "1.0.8"),
  buildDate: getEnvVar("VITE_BUILD_DATE", new Date().toISOString()),
  commitHash: getEnvVar("VITE_COMMIT_HASH", "unknown"),
  timestamp: "CACHE_BUST_PROD_v108_FORCED_" + Date.now(), // Timestamp dinámico para verificar cache busting
};

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
    version: buildInfo.version,
    buildDate: buildInfo.buildDate,
    commitHash: buildInfo.commitHash,
    timestamp: buildInfo.timestamp,
    description: getEnvVar(
      "APP_DESCRIPTION",
      "Generador de datos ecuatorianos válidos para desarrollo y testing"
    ),
  },
};

// Función para logging de configuración
export const logConfig = () => {
  const logData = {
    app: config.app.name,
    version: config.app.version,
    environment: config.production ? "production" : "development",
    buildDate: config.app.buildDate,
    commitHash: config.app.commitHash,
    timestamp: config.app.timestamp,
    apiUrl: config.apiUrl,
    baseUrl: config.baseUrl,
  };

  if (config.production) {
    console.log("🚀 GeneradorEC en Producción:", logData);
  } else {
    console.log("🔧 Configuración de desarrollo:", logData);
  }
};

export default config;
