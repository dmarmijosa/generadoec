# Docker Configuration - GeneradorEC

## Actualizaciones Realizadas

### Dockerfile Principal
- ✅ Actualizado a Node.js 22 Alpine para mejor rendimiento
- ✅ Añadido soporte completo para Swagger API documentation
- ✅ Optimizaciones de build con flags --silent
- ✅ Health check mejorado para monitoreo
- ✅ Variables de entorno específicas para API
- ✅ Comando de inicio informativo con logs de la API

### Dockerfile.dev (Desarrollo)
- ✅ Actualizado a Node.js 22 Alpine
- ✅ Añadido nodemon para hot reload
- ✅ Health check para entorno de desarrollo
- ✅ Variables de entorno específicas para desarrollo
- ✅ Comandos informativos al inicio

### docker-compose.yml
- ✅ Variables de entorno completas para producción
- ✅ Labels de Traefik para proxy reverso automático
- ✅ Health check actualizado sin dependencia de wget
- ✅ Configuración mejorada para desarrollo con volúmenes optimizados
- ✅ Soporte para SSL automático con Let's Encrypt

## Comandos de Uso

### Desarrollo
```bash
# Iniciar en modo desarrollo
docker-compose --profile dev up generadorec-dev

# Con rebuild forzado
docker-compose --profile dev up --build generadorec-dev
```

### Producción
```bash
# Iniciar servicio de producción
docker-compose up generadorec

# Con rebuild
docker-compose up --build generadorec

# En background
docker-compose up -d generadorec
```

### Build Manual
```bash
# Build imagen de producción
docker build -t generadorec:latest .

# Build imagen de desarrollo
docker build -f Dockerfile.dev -t generadorec:dev .

# Run contenedor de producción
docker run -p 3000:3000 -e NODE_ENV=production generadorec:latest

# Run contenedor de desarrollo
docker run -p 3000:3000 -p 5173:5173 -e NODE_ENV=development generadorec:dev
```

## Endpoints Disponibles

- **Aplicación**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health
- **Frontend (dev)**: http://localhost:5173

## Health Checks

Los contenedores incluyen health checks automáticos que verifican:
- ✅ Disponibilidad del endpoint /api/health
- ✅ Respuesta HTTP 200
- ✅ Tiempo de respuesta < 3 segundos
- ✅ Reintentos automáticos (3 veces)

## Variables de Entorno

### Producción
- `NODE_ENV=production`
- `PORT=3000`
- `CORS_ORIGINS=http://localhost:3000,https://generadorec.dmarmijosa.com`
- `APP_NAME=GeneradorEC`
- `APP_VERSION=1.0.0`
- `API_TITLE=GeneradorEC API`
- `API_DESCRIPTION=API para generar datos ecuatorianos válidos`

### Desarrollo
- `NODE_ENV=development`
- `API_TITLE=GeneradorEC API (Development)`
- `CORS_ORIGINS=http://localhost:5173,http://localhost:3000`

## Optimizaciones Implementadas

1. **Build Multi-Stage**: Separación de dependencias y build
2. **Node.js 22**: Última versión LTS para mejor rendimiento
3. **Alpine Linux**: Imágenes más ligeras y seguras
4. **Cache Layers**: Optimización de layers para builds más rápidos
5. **Health Checks**: Monitoreo automático de servicios
6. **Security**: Usuario no-root para ejecución segura
7. **Hot Reload**: Desarrollo con recarga automática
8. **Swagger Integration**: Documentación API automática

## Troubleshooting

### Problema: Puerto ocupado
```bash
# Verificar procesos en puerto 3000
lsof -i :3000

# Detener contenedores
docker-compose down
```

### Problema: Build fails
```bash
# Limpiar cache de Docker
docker system prune -a

# Rebuild sin cache
docker-compose build --no-cache
```

### Problema: Logs
```bash
# Ver logs del contenedor
docker-compose logs generadorec

# Seguir logs en tiempo real
docker-compose logs -f generadorec
```
