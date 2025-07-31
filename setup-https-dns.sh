#!/bin/bash
#
# Script completo para configurar HTTPS con cert-manager y Let's Encrypt
# usando DNS-01 challenge con CloudNS.
#

echo "🚀 Iniciando configuración de certificado SSL válido con DNS-01..."

# --- PASO 1: Limpieza de configuraciones SSL anteriores ---
echo "🧹 Paso 1/5: Limpiando configuraciones de certificados anteriores..."
kubectl delete certificate generadorec-selfsigned -n generadorec --ignore-not-found=true
kubectl delete certificate generadorec-tls -n generadorec --ignore-not-found=true
kubectl delete clusterissuer selfsigned-issuer --ignore-not-found=true
kubectl delete clusterissuer letsencrypt-prod --ignore-not-found=true
kubectl delete secret generadorec-tls -n generadorec --ignore-not-found=true
echo "✅ Limpieza completada."

# --- PASO 2: Instalar el Webhook de CloudNS para cert-manager ---
echo "📦 Paso 2/5: Instalando el webhook de CloudNS para cert-manager..."
kubectl apply -f https://github.com/cloudns/cert-manager-webhook-cloudns/releases/download/v1.2.0/bundle.yaml
echo "⏳ Esperando que el webhook de CloudNS esté listo..."
kubectl wait --for=condition=ready pod -l app=cert-manager-webhook-cloudns -n cert-manager --timeout=300s
echo "✅ Webhook de CloudNS instalado."

# --- PASO 3: Crear secreto con credenciales de CloudNS ---
echo "🔑 Paso 3/5: Creando secreto con credenciales de CloudNS..."
if ! kubectl get secret cloudns-credentials -n cert-manager > /dev/null 2>&1; then
    echo "Por favor, introduce tus credenciales de CloudNS:"
    read -p "CloudNS Auth ID: " AUTH_ID
    read -s -p "CloudNS Auth Password: " AUTH_PASSWORD
    echo ""

    kubectl create secret generic cloudns-credentials \
      -n cert-manager \
      --from-literal=auth-id="${AUTH_ID}" \
      --from-literal=auth-password="${AUTH_PASSWORD}"
    echo "✅ Secreto 'cloudns-credentials' creado en el namespace 'cert-manager'."
else
    echo "ℹ️  El secreto 'cloudns-credentials' ya existe. Omitiendo creación."
fi

# --- PASO 4: Crear ClusterIssuer para DNS-01 Challenge ---
echo "📝 Paso 4/5: Creando ClusterIssuer para DNS-01 challenge..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-cloudns-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: support-client@dmarmijosa.com
    privateKeySecretRef:
      name: letsencrypt-cloudns-prod-key
    solvers:
    - dns01:
        webhook:
          groupName: acme.cloudns.net
          solverName: cloudns
          config:
            authIdSecretRef:
              name: cloudns-credentials
              key: auth-id
            authPasswordSecretRef:
              name: cloudns-credentials
              key: auth-password
EOF
echo "✅ ClusterIssuer 'letsencrypt-cloudns-prod' creado."

# --- PASO 5: Actualizar y aplicar Ingress para usar el nuevo ClusterIssuer ---
echo "🔄 Paso 5/5: Aplicando Ingress para solicitar el certificado final..."
# Eliminar el ingress anterior para evitar conflictos
kubectl delete ingress generadorec-ingress -n generadorec --ignore-not-found=true
# Aplicar la configuración de Ingress correcta
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: generadorec-ingress
  namespace: generadorec
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-cloudns-prod"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: public
  tls:
  - hosts:
    - generadorec.dmarmijosa.com
    secretName: generadorec-tls
  rules:
  - host: generadorec.dmarmijosa.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: generadorec-service
            port:
              number: 3000
EOF
echo "✅ Ingress configurado para usar 'letsencrypt-cloudns-prod'."

# --- Verificación Final ---
echo ""
echo "🎉 ¡Configuración completada!"
echo "ℹ️  Let's Encrypt está verificando tu dominio a través de DNS. Esto puede tardar de 2 a 5 minutos."
echo "🔍 Para monitorear el progreso, usa los siguientes comandos:"
echo ""
echo "   # 1. Revisa el estado del certificado (espera a que READY sea True):"
echo "   kubectl get certificate -n generadorec --watch"
echo ""
echo "   # 2. Si hay problemas, describe el certificado para ver los eventos:"
echo "   kubectl describe certificate generadorec-tls -n generadorec"
echo ""
echo "   # 3. Revisa los logs del webhook de CloudNS si la validación falla:"
echo "   kubectl logs -n cert-manager -l app=cert-manager-webhook-cloudns"
echo ""
echo "Una vez que el certificado esté listo, tu sitio https://generadorec.dmarmijosa.com tendrá un candado verde y seguro."
