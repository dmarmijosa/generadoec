#!/bin/bash

# Script para preparar y subir GeneradorEC a Docker Hub y desplegar en ArgoCD
# Autor: Danny Armijos
# Uso: ./deploy-to-argocd.sh [version]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
DOCKER_REPO="dmarmijosa/generadorec"
VERSION=${1:-"latest"}
COMPOSE_SERVICE="generadorec"

echo -e "${BLUE}🚀 Iniciando despliegue de GeneradorEC a ArgoCD${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo ""

# Función para verificar si docker está corriendo
check_docker() {
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker no está corriendo. Por favor inicia Docker Desktop.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker está corriendo${NC}"
}

# Función para construir la imagen
build_image() {
    echo -e "${YELLOW}📦 Construyendo imagen Docker...${NC}"
    if docker-compose build --no-cache $COMPOSE_SERVICE; then
        echo -e "${GREEN}✅ Imagen construida exitosamente${NC}"
    else
        echo -e "${RED}❌ Error construyendo la imagen${NC}"
        exit 1
    fi
}

# Función para etiquetar imagen
tag_image() {
    echo -e "${YELLOW}🏷️  Etiquetando imagen...${NC}"
    
    # Etiquetar con la versión especificada
    if docker tag ${COMPOSE_SERVICE/-/_}-${COMPOSE_SERVICE}:latest $DOCKER_REPO:$VERSION; then
        echo -e "${GREEN}✅ Imagen etiquetada como $DOCKER_REPO:$VERSION${NC}"
    else
        echo -e "${RED}❌ Error etiquetando imagen${NC}"
        exit 1
    fi
    
    # Si no es latest, también crear tag latest
    if [ "$VERSION" != "latest" ]; then
        if docker tag ${COMPOSE_SERVICE/-/_}-${COMPOSE_SERVICE}:latest $DOCKER_REPO:latest; then
            echo -e "${GREEN}✅ Imagen etiquetada como $DOCKER_REPO:latest${NC}"
        else
            echo -e "${RED}❌ Error etiquetando imagen como latest${NC}"
            exit 1
        fi
    fi
}

# Función para subir imagen
push_image() {
    echo -e "${YELLOW}⬆️  Subiendo imagen a Docker Hub...${NC}"
    
    # Verificar login
    if ! docker info | grep -q "Username:"; then
        echo -e "${YELLOW}🔐 Realizando login a Docker Hub...${NC}"
        if ! docker login; then
            echo -e "${RED}❌ Error en login a Docker Hub${NC}"
            exit 1
        fi
    fi
    
    # Subir imagen con versión
    echo -e "${YELLOW}📤 Subiendo $DOCKER_REPO:$VERSION...${NC}"
    if docker push $DOCKER_REPO:$VERSION; then
        echo -e "${GREEN}✅ Imagen $VERSION subida exitosamente${NC}"
    else
        echo -e "${RED}❌ Error subiendo imagen $VERSION${NC}"
        exit 1
    fi
    
    # Subir latest si es diferente versión
    if [ "$VERSION" != "latest" ]; then
        echo -e "${YELLOW}📤 Subiendo $DOCKER_REPO:latest...${NC}"
        if docker push $DOCKER_REPO:latest; then
            echo -e "${GREEN}✅ Imagen latest subida exitosamente${NC}"
        else
            echo -e "${RED}❌ Error subiendo imagen latest${NC}"
            exit 1
        fi
    fi
}

# Función para verificar kubectl
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${YELLOW}⚠️  kubectl no encontrado. Saltando verificación de Kubernetes.${NC}"
        return 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${YELLOW}⚠️  No conectado a cluster Kubernetes. Saltando verificación.${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Conectado a cluster Kubernetes${NC}"
    return 0
}

# Función para mostrar información de ArgoCD
show_argocd_info() {
    echo ""
    echo -e "${BLUE}🎯 Próximos pasos para ArgoCD:${NC}"
    echo ""
    echo -e "${YELLOW}1. Accede a tu ArgoCD UI${NC}"
    echo -e "${YELLOW}2. Crea una nueva aplicación con:${NC}"
    echo -e "   - Application Name: ${GREEN}generadorec${NC}"
    echo -e "   - Project: ${GREEN}default${NC}"
    echo -e "   - Repository URL: ${GREEN}https://github.com/dmarmijosa/generadoec${NC}"
    echo -e "   - Revision: ${GREEN}HEAD${NC}"
    echo -e "   - Path: ${GREEN}k8s${NC}"
    echo -e "   - Cluster URL: ${GREEN}https://kubernetes.default.svc${NC}"
    echo -e "   - Namespace: ${GREEN}generadorec${NC}"
    echo -e "   - Sync Policy: ${GREEN}Automatic ✅${NC}"
    echo ""
    echo -e "${YELLOW}3. O usa kubectl:${NC}"
    echo -e "   ${GREEN}kubectl apply -f k8s/argocd-application.yaml${NC}"
    echo ""
    echo -e "${YELLOW}4. Verificar despliegue:${NC}"
    echo -e "   ${GREEN}kubectl get pods -n generadorec${NC}"
    echo -e "   ${GREEN}kubectl get ingress -n generadorec${NC}"
    echo ""
    echo -e "${BLUE}📚 Documentación completa: ARGOCD-DEPLOYMENT.md${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}Verificando prerrequisitos...${NC}"
    check_docker
    
    echo ""
    echo -e "${BLUE}Iniciando proceso de build y despliegue...${NC}"
    build_image
    tag_image
    push_image
    
    echo ""
    echo -e "${GREEN}🎉 ¡Proceso completado exitosamente!${NC}"
    echo -e "${GREEN}📦 Imagen disponible en: https://hub.docker.com/r/$DOCKER_REPO${NC}"
    
    # Verificar kubectl y mostrar info
    if check_kubectl; then
        echo -e "${GREEN}✅ Todo listo para desplegar en ArgoCD${NC}"
    fi
    
    show_argocd_info
}

# Verificar si se pide ayuda
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Script de despliegue para GeneradorEC"
    echo ""
    echo "Uso: $0 [version]"
    echo ""
    echo "Parámetros:"
    echo "  version    Versión de la imagen (default: latest)"
    echo ""
    echo "Ejemplos:"
    echo "  $0                 # Despliega como latest"
    echo "  $0 v1.0.0         # Despliega como v1.0.0"
    echo "  $0 v1.2.3         # Despliega como v1.2.3"
    echo ""
    echo "Este script:"
    echo "  1. Construye la imagen Docker"
    echo "  2. La etiqueta correctamente"
    echo "  3. La sube a Docker Hub"
    echo "  4. Muestra instrucciones para ArgoCD"
    exit 0
fi

# Ejecutar función principal
main
