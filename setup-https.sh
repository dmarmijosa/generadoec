#!/bin/bash
# Setup HTTPS with cert-manager and Let's Encrypt

echo "🔐 Configurando HTTPS con cert-manager..."

# Instalar cert-manager
echo "📦 Instalando cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Esperar a que cert-manager esté listo
echo "⏳ Esperando que cert-manager esté listo..."
kubectl wait --for=condition=ready pod -l app=cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=ready pod -l app=cainjector -n cert-manager --timeout=300s
kubectl wait --for=condition=ready pod -l app=webhook -n cert-manager --timeout=300s

echo "✅ cert-manager instalado correctamente"

# Crear ClusterIssuer para Let's Encrypt
echo "📝 Creando ClusterIssuer para Let's Encrypt..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: support-client@dmarmijosa.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: public
EOF

echo "✅ ClusterIssuer creado"

# Aplicar ingress con TLS
echo "📝 Aplicando ingress con TLS..."
kubectl delete ingress generadorec-ingress -n generadorec --ignore-not-found=true
kubectl apply -f k8s/ingress.yaml

echo "🔍 Verificando certificado..."
kubectl get certificate -n generadorec
kubectl describe certificate -n generadorec

echo ""
echo "✅ ¡HTTPS configurado!"
echo "   🌐 Accede a: https://generadorec.dmarmijosa.com"
echo "   📊 Generador: https://generadorec.dmarmijosa.com/generator"
echo ""
echo "ℹ️  El certificado puede tardar 1-2 minutos en generarse"
echo "ℹ️  Puedes verificar el progreso con: kubectl describe certificate -n generadorec"
