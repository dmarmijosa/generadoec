# Dockerfile multi-stage para GeneradorEC con Swagger API
# Etapa 1: Build del Frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copiar package.json del frontend
COPY apps/frontend/package*.json ./frontend/
RUN cd frontend && npm ci --silent

# Copiar código fuente del frontend
COPY apps/frontend ./frontend/

# Build del frontend con optimizaciones
RUN cd frontend && npm run build

# Etapa 2: Build del Backend
FROM node:22-alpine AS backend-builder

WORKDIR /app

# Copiar package.json del backend
COPY apps/backend/package*.json ./backend/
RUN cd backend && npm ci --silent

# Copiar código fuente del backend
COPY apps/backend ./backend/

# Build del backend con TypeScript
RUN cd backend && npm run build

# Etapa 3: Imagen de producción
FROM node:22-alpine AS production

WORKDIR /app

# Instalar solo dependencias de producción del backend
COPY apps/backend/package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# Copiar el build del backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copiar el build del frontend al directorio que espera el backend
COPY --from=frontend-builder /app/frontend/dist ./apps/frontend/dist

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar propiedad de archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000
ENV CORS_ORIGINS="http://localhost:3000,https://generadorec.dmarmijosa.com"
ENV APP_NAME="GeneradorEC"
ENV APP_VERSION="1.0.0"
ENV API_TITLE="GeneradorEC API"
ENV API_DESCRIPTION="API para generar datos ecuatorianos válidos para desarrollo y testing"

# Exponer puerto
EXPOSE 3000

# Health check para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Comando de inicio con información de la API
CMD ["sh", "-c", "echo '🚀 Iniciando GeneradorEC API v${APP_VERSION}' && echo '📚 Documentación Swagger disponible en /api/docs' && node dist/main"]
