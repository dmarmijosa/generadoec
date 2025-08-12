import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configuración para agregar variables de entorno en build time
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify("1.0.11"),
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(new Date().toISOString()),
    "import.meta.env.VITE_COMMIT_HASH": JSON.stringify("v1.0.11-" + Date.now()),
    "import.meta.env.VITE_BUILD_TIMESTAMP": JSON.stringify(Date.now()),
  },

  build: {
    // Configurar el output para incluir hashes en los nombres de archivos
    rollupOptions: {
      output: {
        // Hash en archivos JS/CSS para invalidar caché
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || "")) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/css/i.test(ext || "")) {
            return `assets/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },

    // Configuración adicional para optimización
    sourcemap: false, // Deshabilitado para producción
    minify: "esbuild", // Cambiar a esbuild que está incluido por defecto
    target: "es2015",
  },

  // Configuración para desarrollo
  server: {
    port: 5173,
    host: true,
  },
});
