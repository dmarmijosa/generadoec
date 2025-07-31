# Dockerfile multi-stage para GeneradorEC
# Etapa 1: Build del Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copiar package.json del frontend
COPY apps/frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copiar código fuente del frontend
COPY apps/frontend ./frontend/

# Build del frontend
RUN cd frontend && npm run build

# Etapa 2: Build del Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copiar package.json del backend
COPY apps/backend/package*.json ./backend/
RUN cd backend && npm ci

# Copiar código fuente del backend
COPY apps/backend ./backend/

# Build del backend
RUN cd backend && npm run build

# Etapa 3: Imagen de producción
FROM node:18-alpine AS production

WORKDIR /app

# Instalar solo dependencias de producción del backend
COPY apps/backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

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

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV CORS_ORIGINS="http://localhost:3000,https://generadorec.dmarmijosa.com"
ENV APP_NAME="GeneradorEC"
ENV APP_VERSION="1.0.0"

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]
