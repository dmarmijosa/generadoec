# Guía de Despliegue - GeneradorEC

## 🚀 Descripción
Sistema completo de generación de datos ecuatorianos con backend en NestJS y frontend en React, configurado para servirse desde una sola aplicación.

## 📋 Características Implementadas

### ✅ Backend (NestJS)
- **Generación realista de datos ecuatorianos**
  - Cédulas válidas con algoritmo oficial
  - Nombres y apellidos auténticos por provincia
  - Direcciones realistas por cantón
  - Teléfonos con prefijos correctos por provincia
  - RUCs válidos para empresas

- **API RESTful completa**
  - `POST /api/generator/people` - Generar personas
  - `POST /api/generator/companies` - Generar empresas
  - `GET /api/generator/provinces` - Listar provincias
  - `GET /api/generator/quick` - Datos rápidos
  - `GET /api/generator/health` - Estado de salud

- **Configuración de producción**
  - Servir archivos estáticos del frontend
  - CORS configurado para desarrollo
  - Exclusión de rutas API para archivos estáticos

### ✅ Frontend (React + TypeScript)
- **Diseño totalmente responsivo**
  - Vista de tabla en desktop/tablet
  - Vista de tarjetas en móviles
  - Navegación optimizada para touch
  - Breakpoints adaptables

- **Funcionalidades avanzadas**
  - Configuración dinámica de campos
  - Exportación a CSV
  - Copia al portapapeles
  - Generación en tiempo real

- **Aspectos legales y éticos**
  - Banner de disclaimer prominente
  - Advertencias en header y footer
  - Múltiples avisos sobre datos ficticios

### ✅ Branding y UX
- **Favicon personalizado** con colores de Ecuador (EC)
- **Paleta de colores** basada en la bandera ecuatoriana
- **Botón de donación** flotante para Buy Me a Coffee
- **Información del autor** en footer

### ✅ Google Analytics
- **Firebase Analytics** completamente integrado
- **Tracking de navegación** automático
- **Eventos personalizados** para generación de datos
- **Tracking de enlaces externos** (GitHub, LinkedIn, Buy me coffee)
- **Métricas de uso** para optimización

### ✅ Containerización y Orquestación
- **Docker multi-stage** optimizado
- **Kubernetes manifests** completos
- **ArgoCD GitOps** configurado
- **Health checks** y monitoring
- **Horizontal Pod Autoscaler** para escalado automático

## 🛠️ Comandos de Desarrollo

### Instalación
```bash
npm run install:all
```

### Desarrollo (Frontend y Backend simultáneo)
```bash
npm run dev
```

### Solo Backend
```bash
npm run dev:backend
```

### Solo Frontend
```bash
npm run dev:frontend
```

## 🚀 Despliegue en Producción

### Build Completo
```bash
npm run build
```

### Iniciar en Producción
```bash
npm run start:prod
```

### Proceso Manual
```bash
# 1. Construir frontend
npm run build:frontend

# 2. Construir backend
npm run build:backend

# 3. Iniciar servidor de producción
cd apps/backend && npm run start:prod
```

## 🌐 URLs y Puertos

### Desarrollo
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API**: http://localhost:3001/api

### Producción
- **Aplicación completa**: http://localhost:3001
- **API**: http://localhost:3001/api

## 📁 Estructura de Archivos

```
generadoec/
├── apps/
│   ├── backend/                     # NestJS API Server
│   │   ├── src/
│   │   │   ├── controllers/        # Controladores API
│   │   │   ├── services/           # Servicios de negocio
│   │   │   ├── utils/              # Utilidades (cédula, etc.)
│   │   │   └── data/               # Datos de Ecuador
│   │   └── dist/                   # Build de producción
│   └── frontend/                   # React Application
│       ├── src/
│       │   ├── components/         # Componentes reutilizables
│       │   ├── pages/             # Páginas de la aplicación
│       │   ├── services/          # Servicios de API
│       │   └── environments/      # Configuraciones
│       └── dist/                  # Build de producción
├── package.json                   # Scripts principales
└── DEPLOYMENT.md                  # Esta documentación
```

## 🔧 Configuraciones Importantes

### Backend (apps/backend/src/app.module.ts)
```typescript
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
  exclude: ['/api*'], // Excluir rutas API
})
```

### Frontend Production (apps/frontend/src/environments/environment.prod.ts)
```typescript
apiUrl: "/api" // URL relativa para producción
```

## 🎨 Responsive Design

### Desktop/Tablet (md+)
- Tabla completa con todas las columnas
- Sidebar de configuración
- Navegación horizontal

### Mobile (sm)
- Vista de tarjetas apiladas
- Botones de acción por tarjeta
- Navegación optimizada para touch

## ⚖️ Aspectos Legales

### Disclaimers Implementados
- Banner superior permanente
- Advertencias en header ("Datos de Prueba")
- Avisos en footer
- Múltiples recordatorios sobre datos ficticios

### Mensaje Principal
> ⚠️ IMPORTANTE: Todos los datos generados son completamente ficticios y creados únicamente para propósitos de desarrollo y pruebas. No representan personas, empresas o ubicaciones reales. El autor no se hace responsable del uso indebido de esta herramienta.

## 📊 Testing

### Verificación de API
```bash
# Health check
curl http://localhost:3001/api/generator/health

# Generar datos
curl -X POST http://localhost:3001/api/generator/people \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Verificación Frontend
- Acceder a http://localhost:3001
- Probar generación de datos
- Verificar responsividad en diferentes tamaños de pantalla
- Confirmar exportación CSV
- Probar copia al portapapeles

## 🐛 Solución de Problemas

### Puerto en uso
```bash
lsof -ti:3001 | xargs kill -9
```

### Rebuild completo
```bash
rm -rf apps/*/dist apps/*/node_modules
npm run install:all
npm run build
```

### Verificar servicios
```bash
ps aux | grep node
```

## 🚀 Despliegue en Kubernetes con ArgoCD

### Preparación de la Imagen Docker
```bash
# Construir imagen
docker-compose build generadorec

# Etiquetar para Docker Hub
docker tag generadoec-generadorec:latest dmarmijosa/generadorec:latest
docker tag generadoec-generadorec:latest dmarmijosa/generadorec:v1.0.0

# Subir a Docker Hub
docker login
docker push dmarmijosa/generadorec:latest
docker push dmarmijosa/generadorec:v1.0.0
```

### Configuración Kubernetes
Los manifests están en `/k8s/`:
- `namespace.yaml` - Namespace dedicado
- `deployment.yaml` - Deployment con 2 replicas
- `service.yaml` - Servicio ClusterIP
- `ingress.yaml` - Ingress con SSL
- `configmap.yaml` - Variables de entorno
- `hpa.yaml` - Autoscaling horizontal
- `poddisruptionbudget.yaml` - Presupuesto de disrupción

### Despliegue con ArgoCD
Ver documentación detallada: [ARGOCD-DEPLOYMENT.md](./ARGOCD-DEPLOYMENT.md)

**Pasos rápidos:**
1. Acceder a ArgoCD UI
2. Crear nueva aplicación con:
   - **Repo:** `https://github.com/dmarmijosa/generadoec`
   - **Path:** `k8s`
   - **Namespace:** `generadorec`
3. Habilitar sync automático
4. Sincronizar aplicación

### URLs en Producción
- **App:** https://generadorec.dmarmijosa.com
- **API:** https://generadorec.dmarmijosa.com/api/docs
- **Health:** https://generadorec.dmarmijosa.com/api/generator/health

## 📝 Notas de Desarrollo

1. **Datos realistas**: Todos los algoritmos siguen las especificaciones oficiales ecuatorianas
2. **Performance**: Generación optimizada para grandes volúmenes
3. **SEO Ready**: Meta tags y estructura HTML semántica
4. **Accesibilidad**: Diseño inclusivo con navegación por teclado
5. **Progressive Enhancement**: Funciona sin JavaScript para contenido básico

---

**Desarrollado por**: Danny Armijos  
**Sitio Web**: https://www.danny-armijos.com/  
**Soporte**: support-client@dmarmijosa.com
