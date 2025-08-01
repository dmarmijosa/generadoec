import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Logging simplificado para producción
const IS_PRODUCTION = import.meta.env.PROD;

if (IS_PRODUCTION) {
  console.log("Producción");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
