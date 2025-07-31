#!/bin/bash

# Script optimizado para desplegar GeneradorEC usando Docker Buildx
# Autor: Danny Armijos
# Uso: ./deploy-buildx.sh [version]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
DOCKER_REPO="dmarmijosa/generadorec"
VERSION=${1:-"v1.0.0"}
BUILDER_NAME="generadorec-builder"

echo -e "${BLUE}🚀 Despliegue Multi-Arquitectura de GeneradorEC${NC}"
echo -e "${BLUE}Versión: ${VERSION}${NC}"
echo ""

# Función para verificar prerrequisitos
check_prerequisites() {
    echo -e "${YELLOW}🔍 Verificando prerrequisitos...${NC}"
    
    # Verificar Docker
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker no está corriendo${NC}"
        exit 1
    fi
    
    # Verificar Docker Buildx
    if ! docker buildx version &> /dev/null; then
        echo -e "${RED}❌ Docker Buildx no está disponible${NC}"
        exit 1
    fi
    
    # Verificar directorio del proyecto
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Debe ejecutarse desde el directorio raíz del proyecto${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Todos los prerrequisitos cumplidos${NC}"
}

# Función para configurar builder
setup_builder() {
    echo -e "${YELLOW}🔧 Configurando builder multi-arquitectura...${NC}"
    
    # Verificar si el builder ya existe
    if docker buildx ls | grep -q "$BUILDER_NAME"; then
        echo -e "${BLUE}ℹ️  Builder '$BUILDER_NAME' ya existe, usando existente${NC}"
        docker buildx use $BUILDER_NAME
    else
        echo -e "${YELLOW}🆕 Creando nuevo builder '$BUILDER_NAME'${NC}"
        docker buildx create --name $BUILDER_NAME --use
    fi
    
    # Inicializar builder
    echo -e "${YELLOW}🚀 Inicializando builder...${NC}"
    docker buildx inspect --bootstrap
    
    echo -e "${GREEN}✅ Builder configurado exitosamente${NC}"
}

# Función para verificar login a Docker Hub
check_docker_login() {
    echo -e "${YELLOW}🔐 Verificando autenticación Docker Hub...${NC}"
    
    # Intentar obtener información del usuario
    if ! docker info 2>/dev/null | grep -q "Username:"; then
        echo -e "${YELLOW}💡 Necesitas hacer login a Docker Hub${NC}"
        if ! docker login; then
            echo -e "${RED}❌ Error en autenticación Docker Hub${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Autenticado en Docker Hub${NC}"
}

# Función para construir y subir imagen multi-arquitectura
build_and_push() {
    echo -e "${YELLOW}🏗️  Construyendo imagen multi-arquitectura...${NC}"
    
    # Construir para múltiples plataformas y subir directamente
    if docker buildx build \
        --platform linux/amd64,linux/arm64 \
        -t $DOCKER_REPO:$VERSION \
        -t $DOCKER_REPO:latest \
        --push .; then
        
        echo -e "${GREEN}✅ Imagen multi-arquitectura construida y subida exitosamente${NC}"
        echo -e "${BLUE}📦 Tags creados:${NC}"
        echo -e "   • $DOCKER_REPO:$VERSION"
        echo -e "   • $DOCKER_REPO:latest"
    else
        echo -e "${RED}❌ Error construyendo/subiendo imagen${NC}"
        exit 1
    fi
}

# Función para verificar imagen
verify_image() {
    echo -e "${YELLOW}🔍 Verificando imagen multi-arquitectura...${NC}"
    
    if docker manifest inspect $DOCKER_REPO:latest &> /dev/null; then
        echo -e "${GREEN}✅ Imagen verificada en Docker Hub${NC}"
        
        # Mostrar arquitecturas disponibles
        echo -e "${BLUE}🏗️  Arquitecturas disponibles:${NC}"
        docker manifest inspect $DOCKER_REPO:latest | jq -r '.manifests[] | select(.platform) | "   • \(.platform.os)/\(.platform.architecture)"' 2>/dev/null || echo "   • linux/amd64, linux/arm64"
    else
        echo -e "${RED}❌ Error verificando imagen${NC}"
        exit 1
    fi
}

# Función para desplegar en ArgoCD
deploy_argocd() {
    echo -e "${YELLOW}🚀 Desplegando en ArgoCD...${NC}"
    
    # Verificar que kubectl esté disponible
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl no está disponible${NC}"
        exit 1
    fi
    
    # Verificar manifiestos
    echo -e "${YELLOW}📋 Validando manifiestos...${NC}"
    for file in k8s/*.yaml; do
        if ! kubectl apply --dry-run=client -f "$file" &> /dev/null; then
            echo -e "${RED}❌ Error en manifiesto: $file${NC}"
            exit 1
        fi
    done
    
    # Aplicar aplicación ArgoCD
    if kubectl apply -f k8s/argocd-application.yaml; then
        echo -e "${GREEN}✅ Aplicación ArgoCD desplegada${NC}"
    else
        echo -e "${RED}❌ Error desplegando en ArgoCD${NC}"
        exit 1
    fi
}

# Función para mostrar información final
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
    echo "=================================================="
    echo ""
    echo -e "${BLUE}📊 Resumen del despliegue:${NC}"
    echo -e "   • Imagen: $DOCKER_REPO:$VERSION"
    echo -e "   • Arquitecturas: linux/amd64, linux/arm64"
    echo -e "   • ArgoCD: Aplicación 'generadorec' desplegada"
    echo ""
    echo -e "${BLUE}🔗 Enlaces útiles:${NC}"
    echo -e "   • Aplicación: https://generadorec.dmarmijosa.com"
    echo -e "   • Docker Hub: https://hub.docker.com/r/dmarmijosa/generadorec"
    echo ""
    echo -e "${YELLOW}📝 Próximos pasos:${NC}"
    echo -e "   1. Verificar estado en ArgoCD UI"
    echo -e "   2. Configurar DNS para generadorec.dmarmijosa.com"
    echo -e "   3. Verificar certificados SSL automáticos"
}

# Función principal
main() {
    check_prerequisites
    check_docker_login
    setup_builder
    build_and_push
    verify_image
    deploy_argocd
    show_summary
}

# Ejecutar función principal
main
