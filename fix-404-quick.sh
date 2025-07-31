#!/bin/bash

# Script de solución rápida para el 404
# Uso: ./fix-404-quick.sh

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Solución rápida para el error 404${NC}"
echo "========================================="

echo -e "\n${YELLOW}1. Aplicando ingress sin TLS...${NC}"
kubectl apply -f k8s/ingress-no-tls.yaml

echo -e "\n${YELLOW}2. Verificando estado de los pods...${NC}"
kubectl get pods -n generadorec

echo -e "\n${YELLOW}3. Verificando service y endpoints...${NC}"
kubectl get svc,endpoints -n generadorec

echo -e "\n${YELLOW}4. Verificando ingress...${NC}"
kubectl get ingress -n generadorec

echo -e "\n${YELLOW}5. Esperando 10 segundos para que se apliquen los cambios...${NC}"
sleep 10

echo -e "\n${YELLOW}6. Probando conectividad HTTP...${NC}"
echo "Probando: http://generadorec.dmarmijosa.com"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://generadorec.dmarmijosa.com || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ ¡Aplicación funcionando correctamente!${NC}"
    echo "Accede a: http://generadorec.dmarmijosa.com"
elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${RED}❌ Todavía 404. Problema en la aplicación o service.${NC}"
    echo "Ejecutando diagnóstico adicional..."
    
    echo -e "\n${YELLOW}Port-forward para test directo:${NC}"
    kubectl port-forward service/generadorec-service 8080:80 -n generadorec &
    PF_PID=$!
    sleep 3
    
    LOCAL_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 || echo "000")
    echo "Código de respuesta del service directo: $LOCAL_CODE"
    
    if [ "$LOCAL_CODE" = "200" ]; then
        echo -e "${YELLOW}⚠️  Service funciona, problema en Ingress${NC}"
    else
        echo -e "${RED}❌ Service no responde, problema en la aplicación${NC}"
        echo -e "\n${YELLOW}Logs de la aplicación:${NC}"
        kubectl logs --tail=20 -l app=generadorec -n generadorec
    fi
    
    kill $PF_PID 2>/dev/null || true
else
    echo -e "${RED}❌ Error HTTP: $HTTP_CODE${NC}"
fi

echo -e "\n${BLUE}🎯 Resultado:${NC}"
echo "HTTP Code: $HTTP_CODE"
echo "URL de testing: http://generadorec.dmarmijosa.com"
