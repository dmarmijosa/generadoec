#!/bin/bash

# Script de diagnóstico para el error 404
# Uso: ./diagnose-404.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Diagnóstico del error 404 - GeneradorEC${NC}"
echo "============================================="

# 1. Verificar namespace
echo -e "\n${YELLOW}1. Verificando namespace...${NC}"
if kubectl get namespace generadorec &>/dev/null; then
    echo -e "${GREEN}✅ Namespace 'generadorec' existe${NC}"
else
    echo -e "${RED}❌ Namespace 'generadorec' no existe${NC}"
    exit 1
fi

# 2. Verificar pods
echo -e "\n${YELLOW}2. Verificando pods...${NC}"
kubectl get pods -n generadorec
echo ""
kubectl describe pods -n generadorec | grep -E "(Status|Ready|Restart)"

# 3. Verificar services
echo -e "\n${YELLOW}3. Verificando services...${NC}"
kubectl get svc -n generadorec
echo ""
kubectl get endpoints -n generadorec

# 4. Verificar ingress
echo -e "\n${YELLOW}4. Verificando ingress...${NC}"
kubectl get ingress -n generadorec
echo ""

# 5. Test de conectividad al service
echo -e "\n${YELLOW}5. Test de conectividad directa...${NC}"
echo "Haciendo port-forward al service..."

# Ejecutar port-forward en background
kubectl port-forward service/generadorec-service 8080:80 -n generadorec &
PF_PID=$!

# Esperar a que el port-forward esté listo
sleep 3

# Test de conectividad
echo "Probando conectividad a http://localhost:8080..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|302\|404"; then
    echo -e "${GREEN}✅ Service responde${NC}"
    echo "Respuesta completa:"
    curl -I http://localhost:8080 2>/dev/null || echo "Error en curl"
else
    echo -e "${RED}❌ Service no responde${NC}"
fi

# Matar el port-forward
kill $PF_PID 2>/dev/null || true

# 6. Logs de la aplicación
echo -e "\n${YELLOW}6. Logs de la aplicación (últimas 20 líneas)...${NC}"
kubectl logs --tail=20 -l app=generadorec -n generadorec

# 7. Verificar configuración del ingress
echo -e "\n${YELLOW}7. Configuración del Ingress...${NC}"
kubectl describe ingress generadorec-ingress -n generadorec

echo -e "\n${BLUE}🎯 Diagnóstico completado${NC}"
echo "============================================="
echo ""
echo -e "${YELLOW}📝 Próximos pasos sugeridos:${NC}"
echo "1. Si los pods no están Ready → revisar logs"
echo "2. Si el service no responde → verificar puertos"
echo "3. Si hay problemas de TLS → usar ingress-no-tls.yaml"
echo "4. Para testing rápido → kubectl port-forward service/generadorec-service 8080:80 -n generadorec"
