#!/bin/bash
# Fix SSL Certificate - Use DNS Challenge for Let's Encrypt

echo "🔐 Solucionando certificado SSL con DNS challenge..."

# Eliminar cert-manager existente y configuración que no funciona
echo "🧹 Limpiando configuración anterior..."
kubectl delete clusterissuer letsencrypt-prod --ignore-not-found=true

# Crear ClusterIssuer con DNS challenge (requiere menos configuración que HTTP)
echo "📝 Creando ClusterIssuer para DNS challenge..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: support-client@dmarmijosa.com
    privateKeySecretRef:
      name: letsencrypt-dns
    solvers:
    - selector:
        dnsZones:
        - "dmarmijosa.com"
      dns01:
        webhook:
          groupName: acme.dns.webhook
          solverName: cloudns
          config:
            apiUrl: "https://api.cloudns.net"
            authId: "YOUR_CLOUDNS_AUTH_ID"
            password: "YOUR_CLOUDNS_PASSWORD"
EOF

echo "⚠️  NOTA: Necesitas configurar las credenciales de CloudNS para el DNS challenge"
echo "   O podemos usar un certificado manual/existente"

# Alternativamente, crear un certificado autofirmado válido temporalmente
echo "📝 Creando certificado auto-firmado temporal..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: generadorec-selfsigned
  namespace: generadorec
spec:
  secretName: generadorec-tls
  issuerRef:
    name: selfsigned-issuer
    kind: ClusterIssuer
  dnsNames:
  - generadorec.dmarmijosa.com
  - www.generadorec.dmarmijosa.com
EOF

echo "✅ Certificado auto-firmado creado como solución temporal"

# Aplicar ingress con TLS usando el certificado auto-firmado
echo "📝 Aplicando ingress con TLS..."
kubectl delete ingress generadorec-ingress -n generadorec --ignore-not-found=true
kubectl apply -f k8s/ingress.yaml

echo ""
echo "✅ Certificado SSL configurado (auto-firmado temporal)"
echo "   🌐 Accede a: https://generadorec.dmarmijosa.com"
echo ""
echo "ℹ️  El navegador mostrará advertencia de certificado auto-firmado"
echo "ℹ️  Para producción, configura DNS challenge con CloudNS o usa certificado existente"
