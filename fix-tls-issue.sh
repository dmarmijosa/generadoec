#!/bin/bash
# Fix TLS Issue - Apply HTTP-only ingress temporarily

echo "🔧 Solucionando problema de TLS..."

# Eliminar el ingress con TLS si existe
echo "📝 Eliminando ingress con TLS..."
kubectl delete ingress generadorec-ingress -n generadorec --ignore-not-found=true

# Aplicar el ingress sin TLS
echo "📝 Aplicando ingress sin TLS..."
kubectl apply -f k8s/ingress-no-tls.yaml

# Esperar un momento
sleep 5

# Reiniciar el deployment para asegurar que los pods estén frescos
echo "🔄 Reiniciando deployment..."
kubectl rollout restart deployment/generadorec-app -n generadorec

# Verificar el estado
echo "🔍 Verificando estado del deployment..."
kubectl rollout status deployment/generadorec-app -n generadorec

# Mostrar los pods
echo "📋 Estado de los pods:"
kubectl get pods -n generadorec

# Mostrar el ingress
echo "📋 Estado del ingress:"
kubectl get ingress -n generadorec

# Mostrar el servicio
echo "📋 Estado del servicio:"
kubectl get svc -n generadorec

echo "✅ Listo! Ahora puedes acceder a:"
echo "   🌐 http://generadorec.dmarmijosa.com"
echo ""
echo "ℹ️  Nota: Usando HTTP temporal hasta resolver certificados TLS"
