import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Timestamp único para verificar que el código se actualiza
const BUILD_TIMESTAMP = Date.now(); // Esto será diferente en cada build
console.log("🔥 BUILD TIMESTAMP:", BUILD_TIMESTAMP);
console.log("🚀 Entorno de producción:", import.meta.env.PROD);
console.log("📦 Configuración de la aplicación:", {
  production: import.meta.env.PROD,
  apiUrl: '/api',
  port: 3000,
  baseUrl: '/',
  timestamp: BUILD_TIMESTAMP
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
