# GeneradorEC 🇪🇨

![GeneradorEC Logo](https://img.shields.io/badge/GeneradorEC-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![NestJS](https://img.shields.io/badge/NestJS-10.0.0-E0234E?style=flat-square&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=flat-square&logo=swagger)

## 📋 Descripción

GeneradorEC es una herramienta web completa para generar datos ecuatorianos válidos como cédulas de identidad, nombres, direcciones, teléfonos y más información específica de Ecuador. Inspirado en herramientas similares como generadordni.es, pero adaptado completamente a la realidad ecuatoriana.

🌐 **Sitio Web**: [https://generadorec.dmarmijosa.com](https://generadorec.dmarmijosa.com)
📚 **API Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs) (desarrollo)

## ✨ Características

- 🆔 **Cédulas Válidas**: Genera cédulas ecuatorianas con algoritmo de verificación correcto
- 👤 **Datos Personales**: Nombres y apellidos típicos ecuatorianos
- 📍 **Direcciones Reales**: Ubicaciones por provincia y cantón
- 📱 **Teléfonos**: Números móviles y fijos con códigos correctos
- 🏢 **Empresas**: Razones sociales y RUC válidos
- 📖 **API REST**: Documentada con Swagger para integración
- 🔄 **Datos Dinámicos**: Backend centralizado sin datos hardcodeados
- ✉️ **Emails**: Direcciones de correo electrónico válidas
- 📅 **Fechas**: Fechas de nacimiento realistas
- 💼 **Profesiones**: Ocupaciones comunes en Ecuador
- 🏢 **Empresas**: Nombres de empresas ficticias ecuatorianas

## 🚀 Tecnologías

### Frontend
- **React 19** con TypeScript
- **Tailwind CSS** para diseño responsive
- **Vite** como bundler
- **React Router** para navegación
- **Lucide React** para iconos
- **Integración con API REST**

### Backend
- **NestJS** con TypeScript
- **API RESTful** completamente documentada
- **Swagger/OpenAPI** para documentación automática
- **Algoritmos de validación ecuatorianos**
- **Base de datos centralizada** de nombres y lugares
- **Endpoints optimizados** para diferentes tipos de datos

### DevOps
- **Docker** para contenedores
- **Kubernetes** para orquestación
- **ArgoCD** para despliegue continuo

## 📚 API Documentation

La API está completamente documentada con Swagger y disponible en:

### Endpoints Principales

#### 🔍 Datos Rápidos
```
GET /api/generator/quick?quantity=5&province=Pichincha
```
Genera una muestra rápida de datos para la página principal.

#### 👥 Generar Personas
```
POST /api/generator/people
Content-Type: application/json

{
  "quantity": 10,
  "includeRuc": false,
  "includeCompany": false,
  "province": "Pichincha",
  "ageRange": { "min": 18, "max": 65 }
}
```

#### 🏢 Generar Empresas
```
POST /api/generator/companies
Content-Type: application/json

{
  "quantity": 5,
  "province": "Guayas"
}
```

#### 🗺️ Obtener Provincias
```
GET /api/generator/provinces
```
Devuelve el listado completo de provincias ecuatorianas con sus cantones.

### Acceso a la Documentación

- **Desarrollo**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Producción**: [https://generadorec.dmarmijosa.com/api/docs](https://generadorec.dmarmijosa.com/api/docs)

### Respuesta Estándar
Todos los endpoints devuelven un formato consistente:

```json
{
  "success": true,
  "data": [...],
  "count": 10,
  "timestamp": "2025-01-31T02:17:29.054Z"
}
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 22.9.0+
- npm 11.0.0+
- Git

### Clonar el repositorio
\`\`\`bash
git clone https://github.com/dmarmijosa/generadorec.git
cd generadorec
\`\`\`

### Instalar dependencias
\`\`\`bash
# Instalar todas las dependencias
npm run install:all
\`\`\`

### Ejecutar en desarrollo
\`\`\`bash
# Ejecutar frontend y backend simultáneamente
npm run dev

# O ejecutar por separado:
npm run dev:frontend  # Frontend en http://localhost:5173
npm run dev:backend   # Backend en http://localhost:3000
\`\`\`

### Construcción para producción
\`\`\`bash
npm run build
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
generadorec/
├── apps/
│   ├── frontend/          # Aplicación React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── environments/
│   │   │   └── ...
│   │   └── package.json
│   └── backend/           # API NestJS
│       ├── src/
│       │   ├── modules/
│       │   ├── services/
│       │   └── ...
│       └── package.json
├── docker/               # Configuraciones Docker
├── k8s/                  # Manifiestos Kubernetes
├── libs/                 # Librerías compartidas
└── package.json         # Configuración raíz
\`\`\`

## 🎨 Paleta de Colores Ecuador

- **Amarillo**: #FFDD00
- **Azul**: #034EA2  
- **Rojo**: #EE1C25

## 📊 Scripts Disponibles

\`\`\`bash
npm run dev              # Desarrollo completo
npm run dev:frontend     # Solo frontend
npm run dev:backend      # Solo backend
npm run build           # Construcción completa
npm run build:frontend  # Construcción frontend
npm run build:backend   # Construcción backend
npm run test            # Tests completos
npm run install:all     # Instalar todas las dependencias
\`\`\`

## 🐳 Docker

### Construcción de imágenes
\`\`\`bash
# Frontend
docker build -f docker/frontend.Dockerfile -t generadorec-frontend .

# Backend
docker build -f docker/backend.Dockerfile -t generadorec-backend .
\`\`\`

### Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

## ☸️ Kubernetes & ArgoCD

Los manifiestos de Kubernetes están en la carpeta \`k8s/\` y están configurados para despliegue con ArgoCD.

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📝 Fuentes de Datos

Los datos generados se basan en:
- Registro Civil del Ecuador - Estructura de cédulas
- INEC - Datos demográficos y estadísticos
- División política administrativa del Ecuador
- Nombres comunes registrados en Ecuador
- Códigos telefónicos oficiales

## ⚠️ Aviso Legal

**Importante**: Todos los datos generados son ficticios y no corresponden a personas reales. Esta herramienta está destinada únicamente para propósitos de desarrollo, testing y educación.

## 👨‍💻 Autor

**Danny Armijos**
- 🌐 Website: [https://www.danny-armijos.com/](https://www.danny-armijos.com/)
- 💼 LinkedIn: [https://www.linkedin.com/in/dmarmijosa/](https://www.linkedin.com/in/dmarmijosa/)
- ☕ Buy me a coffee: [https://coff.ee/dmarmijosa](https://coff.ee/dmarmijosa)
- 📧 Email: [support-client@dmarmijosa.com](mailto:support-client@dmarmijosa.com)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Inspirado en [generadordni.es](https://generadordni.es)
- Comunidad ecuatoriana de desarrolladores
- Datos públicos del Gobierno del Ecuador

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐
