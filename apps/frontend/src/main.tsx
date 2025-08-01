import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Timestamp único para verificar que el código se actualiza
const BUILD_TIMESTAMP = Date.now(); // Esto será diferente en cada build
const IS_PRODUCTION = import.meta.env.PROD;
const HOSTNAME = typeof window !== 'undefined' ? window.location.hostname : 'unknown';

console.log("🔥 BUILD TIMESTAMP:", BUILD_TIMESTAMP);
console.log("🚀 Entorno de producción (import.meta.env.PROD):", IS_PRODUCTION);
console.log("🌍 Hostname:", HOSTNAME);
console.log("🔍 import.meta.env.MODE:", import.meta.env.MODE);
console.log("📦 Configuración de la aplicación:", {
  production: IS_PRODUCTION,
  hostname: HOSTNAME,
  mode: import.meta.env.MODE,
  apiUrl: IS_PRODUCTION ? 'https://generadorec.dmarmijosa.com/api' : '/api',
  timestamp: BUILD_TIMESTAMP,
  buildInfo: "v1.0.10-CACHE_BUST_" + BUILD_TIMESTAMP
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
