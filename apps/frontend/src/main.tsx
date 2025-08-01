import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// Inyectar variables de entorno de Vite en window.__ENV__ para producción
if (typeof window !== "undefined") {
  window.__ENV__ = {
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_BUILD_DATE: import.meta.env.VITE_BUILD_DATE,
    VITE_COMMIT_HASH: import.meta.env.VITE_COMMIT_HASH,
    VITE_BUILD_TIMESTAMP: import.meta.env.VITE_BUILD_TIMESTAMP,
    NODE_ENV: import.meta.env.PROD ? "production" : "development",
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
}
import { logConfig } from "./config/config";

logConfig();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
