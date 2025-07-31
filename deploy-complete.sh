#!/bin/bash
# Fix TLS Issue - Deploy complete application with HTTP ingress

echo "🔧 Desplegando GeneradorEC con configuración HTTP..."

# Crear namespace si no existe
echo "📝 Creando namespace..."
kubectl create namespace generadorec --dry-run=client -o yaml | kubectl apply -f -

# Aplicar todos los manifiestos en orden
echo "📝 Aplicando ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "📝 Aplicando Service..."
kubectl apply -f k8s/service.yaml

echo "📝 Aplicando Deployment..."
kubectl apply -f k8s/deployment.yaml

# Esperar a que el deployment esté listo
echo "🔄 Esperando que el deployment esté listo..."
kubectl rollout status deployment/generadorec-app -n generadorec --timeout=300s

# Eliminar ingress con TLS si existe
echo "📝 Eliminando ingress con TLS..."
kubectl delete ingress generadorec-ingress -n generadorec --ignore-not-found=true

# Aplicar ingress sin TLS
echo "📝 Aplicando ingress sin TLS..."
kubectl apply -f k8s/ingress-no-tls.yaml

# Esperar un momento para que se configure
sleep 10

# Verificar estado
echo "🔍 Verificando estado del deployment..."
kubectl get deployment -n generadorec

echo "📋 Estado de los pods:"
kubectl get pods -n generadorec

echo "📋 Estado del servicio:"
kubectl get svc -n generadorec

echo "📋 Estado del ingress:"
kubectl get ingress -n generadorec

# Verificar conectividad
echo "🌐 Probando conectividad..."
kubectl get endpoints -n generadorec

echo ""
echo "✅ ¡Despliegue completado!"
echo "   🌐 Accede a: http://generadorec.dmarmijosa.com"
echo "   📊 Generador: http://generadorec.dmarmijosa.com/generator"
echo ""
echo "ℹ️  Usando HTTP temporal hasta resolver certificados TLS"
