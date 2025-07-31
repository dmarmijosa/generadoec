# Despliegue de GeneradorEC en ArgoCD

## 📋 Prerrequisitos

1. **Cluster de Kubernetes** funcionando
2. **ArgoCD** instalado y configurado
3. **Nginx Ingress Controller** instalado
4. **Cert-Manager** para certificados SSL (opcional)
5. **Metrics Server** para HPA (Horizontal Pod Autoscaler)

## 🐳 Preparación de la Imagen Docker

### 1. Construir y subir la imagen a Docker Hub

**Método Recomendado: Multi-Arquitectura (usando Docker Buildx)**

```bash
# Crear y usar un nuevo builder (solo una vez)
docker buildx create --name generadorec-builder --use

# Construir y subir imágenes multi-arquitectura
docker buildx build --platform linux/amd64,linux/arm64 \
  -t dmarmijosa/generadorec:latest \
  -t dmarmijosa/generadorec:v1.0.0 \
  --push .
```

**Método Alternativo: Arquitectura Simple**

```bash
# Etiquetar la imagen
docker tag generadoec-generadorec:latest dmarmijosa/generadorec:latest
docker tag generadoec-generadorec:latest dmarmijosa/generadorec:v1.0.0

# Login a Docker Hub
docker login

# Subir las imágenes
docker push dmarmijosa/generadorec:latest
docker push dmarmijosa/generadorec:v1.0.0
```

> **⚠️ Nota Importante:** El método multi-arquitectura previene errores de "exec format error" cuando se despliega en clusters con diferentes arquitecturas de CPU (ARM64/AMD64).

## 🚀 Despliegue en ArgoCD

### Opción 1: Usando la UI de ArgoCD

#### Paso 1: Acceder a ArgoCD
1. Abrir la UI de ArgoCD en tu navegador
2. Hacer login con tus credenciales

#### Paso 2: Crear Nueva Aplicación
1. Click en **"+ NEW APP"** en la parte superior
2. Configurar los siguientes campos:

**General:**
- **Application Name:** `generadorec`
- **Project:** `default`
- **Sync Policy:** `Automatic` ✅
  - **Prune Resources:** ✅
  - **Self Heal:** ✅

**Source:**
- **Repository URL:** `https://github.com/dmarmijosa/generadoec`
- **Revision:** `HEAD`
- **Path:** `k8s`

**Destination:**
- **Cluster URL:** `https://kubernetes.default.svc`
- **Namespace:** `generadorec`

**Sync Options:**
- ✅ **Auto-Create Namespace**
- ✅ **Prune Propagation Policy:** `foreground`
- ✅ **Prune Last**

#### Paso 3: Crear y Sincronizar
1. Click en **"CREATE"**
2. Una vez creada, click en **"SYNC"**
3. Click en **"SYNCHRONIZE"**

### Opción 2: Usando kubectl (CLI)

```bash
# Aplicar la aplicación de ArgoCD
kubectl apply -f k8s/argocd-application.yaml

# Verificar que se creó
kubectl get applications -n argocd
```

## 🔧 Configuración Post-Despliegue

### 1. Verificar el Despliegue

```bash
# Verificar namespace
kubectl get namespaces | grep generadorec

# Verificar pods
kubectl get pods -n generadorec

# Verificar servicios
kubectl get services -n generadorec

# Verificar ingress
kubectl get ingress -n generadorec

# Verificar HPA
kubectl get hpa -n generadorec
```

### 2. Configurar DNS

**✅ DNS Ya Configurado:**
- Dominio: `dmarmijosa.com` registrado en CloudNS
- Subdominio: `generadorec.dmarmijosa.com` apuntando a IP pública del servidor ArgoCD

**Verificar configuración DNS:**
```bash
# Verificar que el dominio resuelve a tu IP
nslookup generadorec.dmarmijosa.com

# Debe devolver tu IP pública del servidor
dig generadorec.dmarmijosa.com +short
```

**Para desarrollo/testing local:**
```bash
# Solo si necesitas override local
echo "<TU_IP_PUBLICA> generadorec.dmarmijosa.com" >> /etc/hosts
```

### 3. Verificar Certificados SSL

```bash
# Verificar certificados (si cert-manager está instalado)
kubectl get certificates -n generadorec

# Verificar que el TLS funciona
curl -I https://generadorec.dmarmijosa.com
```

## 📊 Monitoreo y Observabilidad

### Logs de la Aplicación
```bash
# Ver logs en tiempo real
kubectl logs -f deployment/generadorec-app -n generadorec

# Ver logs de pods específicos
kubectl logs -f -l app=generadorec -n generadorec
```

### Health Checks
```bash
# Health check directo
kubectl exec -it deployment/generadorec-app -n generadorec -- curl localhost:3000/api/generator/health

# Desde el exterior (si está configurado)
curl https://generadorec.dmarmijosa.com/api/generator/health
```

### Scaling Manual
```bash
# Escalar manualmente
kubectl scale deployment generadorec-app --replicas=5 -n generadorec

# Ver el estado del HPA
kubectl describe hpa generadorec-hpa -n generadorec
```

## 🛠 Troubleshooting

### Problema: "Issuing certificate as Secret does not exist"

Este es un problema común cuando cert-manager intenta crear certificados TLS. Aquí está la guía step-by-step para solucionarlo:

#### Diagnóstico rápido:
```bash
# 1. Verificar el estado actual
kubectl get ingress -n generadorec
kubectl get certificates -n generadorec
kubectl describe certificate generadorec-tls -n generadorec
```

#### Solución paso a paso:

**Opción 1: Configurar DNS correctamente**
1. Obtener la IP del Ingress Controller:
```bash
kubectl get service -n ingress-nginx
```

2. Configurar tu proveedor DNS para que `generadorec.dmarmijosa.com` apunte a esa IP.

3. Verificar que resuelve:
```bash
nslookup generadorec.dmarmijosa.com
```

**Opción 2: Testing local sin TLS**
1. Usar el ingress sin TLS:
```bash
# Aplicar ingress sin TLS
kubectl apply -f k8s/ingress-no-tls.yaml

# Configurar /etc/hosts local
echo "$(kubectl get ingress generadorec-ingress -n generadorec -o jsonpath='{.status.loadBalancer.ingress[0].ip}') generadorec.dmarmijosa.com" | sudo tee -a /etc/hosts
```

2. Acceder via HTTP: `http://generadorec.dmarmijosa.com`

**Opción 3: Configurar cert-manager desde cero**
```bash
# Instalar cert-manager si no está
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Crear ClusterIssuer
kubectl apply -f - <<EOF
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
          class: nginx
EOF
```

### Problema: "404 Not Found nginx" (Con DNS configurado)

Ya tienes el DNS configurado correctamente (`generadorec.dmarmijosa.com` → tu IP pública). El 404 indica que nginx (Ingress Controller) recibe la petición pero no encuentra tu aplicación.

#### Diagnóstico paso a paso:

1. **Verificar que el dominio resuelve correctamente:**
```bash
# Debe devolver tu IP pública
nslookup generadorec.dmarmijosa.com
curl -I http://generadorec.dmarmijosa.com
```

2. **Verificar que los pods están corriendo:**
```bash
kubectl get pods -n generadorec
kubectl describe pods -n generadorec
```

3. **Verificar que el Service está funcionando:**
```bash
kubectl get svc -n generadorec
kubectl describe svc generadorec-service -n generadorec
kubectl get endpoints -n generadorec
```

4. **Verificar configuración del Ingress:**
```bash
kubectl get ingress -n generadorec -o wide
kubectl describe ingress generadorec-ingress -n generadorec
```

5. **Test directo al Service (port-forward):**
```bash
# Port-forward al service para testing directo
kubectl port-forward service/generadorec-service 8080:80 -n generadorec

# En otra terminal, probar:
curl http://localhost:8080
```

6. **Verificar logs de la aplicación:**
```bash
# Ver logs recientes
kubectl logs --tail=50 -l app=generadorec -n generadorec

# Ver logs en tiempo real
kubectl logs -f -l app=generadorec -n generadorec
```

#### Solución rápida para testing:

**Opción 1: Usar ingress sin TLS temporalmente**
```bash
# Aplicar ingress sin TLS para descartar problemas de certificados
kubectl apply -f k8s/ingress-no-tls.yaml

# Probar vía HTTP
curl http://generadorec.dmarmijosa.com
```

**Opción 2: Verificar que la aplicación funciona localmente**
```bash
# Test directo del container
kubectl exec -it deployment/generadorec-app -n generadorec -- curl localhost:3000

# Si responde, el problema está en el routing del Ingress
```

#### Posibles causas y soluciones:

**Causa 1: Pods no están Ready**
```bash
# Ver logs de los pods
kubectl logs -f deployment/generadorec-app -n generadorec

# Si los pods no están listos, verificar health checks
kubectl describe pods -n generadorec
```

**Causa 2: Selector incorrecto en el Service**
Verificar que el Service tenga el selector correcto:
```bash
kubectl get deployment generadorec-app -n generadorec --show-labels
kubectl get service generadorec-service -n generadorec -o yaml
```

**Causa 3: Puerto incorrecto en el Service**
Verificar que el puerto del Service coincida con el puerto del contenedor:
```bash
# Ver qué puerto expone el pod
kubectl describe pod -l app=generadorec -n generadorec
```

**Causa 4: Path del Ingress incorrecto**
Si usas paths específicos, verificar que coincidan con las rutas de tu aplicación.

### Problemas Comunes

#### 1. Pods no se levantan
```bash
kubectl describe pods -n generadorec
kubectl logs -n generadorec -l app=generadorec
```

#### 2. Problemas de imagen
```bash
# Verificar que la imagen existe en Docker Hub
docker pull dmarmijosa/generadorec:latest

# Verificar el imagePullSecret
kubectl get secrets -n generadorec
```

#### 3. Problemas de conectividad
```bash
# Port-forward para testing local
kubectl port-forward service/generadorec-service 8080:80 -n generadorec

# Acceder a http://localhost:8080
```

#### 4. Problemas de certificados TLS

**Síntoma:** "Issuing certificate as Secret does not exist"

**Posibles causas y soluciones:**

1. **DNS no configurado:**
```bash
# Verificar que el dominio resuelve
nslookup generadorec.dmarmijosa.com

# Si no resuelve, configurar DNS o usar /etc/hosts temporalmente
echo "<INGRESS_IP> generadorec.dmarmijosa.com" | sudo tee -a /etc/hosts
```

2. **Verificar cert-manager:**
```bash
# Verificar que cert-manager está instalado
kubectl get pods -n cert-manager

# Verificar ClusterIssuer
kubectl get clusterissuer

# Si no existe, crear ClusterIssuer básico:
kubectl apply -f - <<EOF
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
          class: nginx
EOF
```

3. **Verificar el proceso de certificado:**
```bash
# Ver estado del certificado
kubectl describe certificate generadorec-tls -n generadorec

# Ver challenges activos
kubectl get challenges -n generadorec

# Ver certificate requests
kubectl get certificaterequests -n generadorec

# Logs de cert-manager
kubectl logs -n cert-manager deployment/cert-manager
```

4. **Solución temporal - Deshabilitar TLS:**
Si necesitas que funcione inmediatamente, puedes comentar la sección TLS en el ingress:
```yaml
# Comentar estas líneas en k8s/ingress.yaml
# tls:
# - hosts:
#   - generadorec.dmarmijosa.com
#   secretName: generadorec-tls
```

### Rollback
```bash
# Rollback usando ArgoCD UI
# 1. Ir a la aplicación en ArgoCD
# 2. Click en "HISTORY AND ROLLBACK"
# 3. Seleccionar la versión anterior
# 4. Click en "ROLLBACK"

# Rollback usando kubectl
kubectl rollout undo deployment/generadorec-app -n generadorec
```

## 🔄 Actualizaciones

### Actualizar la Aplicación
1. **Hacer cambios en el código**
2. **Rebuilding y push de nueva imagen:**
   ```bash
   docker build -t dmarmijosa/generadorec:v1.0.1 .
   docker push dmarmijosa/generadorec:v1.0.1
   ```
3. **Actualizar el deployment:**
   - Cambiar el tag en `k8s/deployment.yaml`
   - Commit y push al repositorio
4. **ArgoCD detectará automáticamente** los cambios y sincronizará

## 📈 Configuración de Producción

### Variables de Entorno Recomendadas
```yaml
env:
- name: NODE_ENV
  value: "production"
- name: PORT
  value: "3000"
- name: API_URL
  value: "https://generadorec.dmarmijosa.com/api"
- name: CORS_ORIGIN
  value: "https://generadorec.dmarmijosa.com"
```

### Resources Recomendados para Producción
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Replicas y Autoscaling
- **Mínimo:** 2 replicas (para alta disponibilidad)
- **Máximo:** 10 replicas (ajustar según necesidades)
- **CPU Target:** 70%
- **Memory Target:** 80%

## ✅ Checklist de Despliegue

- [ ] Imagen subida a Docker Hub
- [ ] Configuración de DNS
- [ ] ArgoCD Application creada
- [ ] Pods corriendo correctamente
- [ ] Service expuesto
- [ ] Ingress configurado
- [ ] SSL/TLS funcionando
- [ ] Health checks pasando
- [ ] HPA configurado
- [ ] Monitoreo activo
- [ ] Documentación actualizada

## 🌐 URLs de Acceso

- **Aplicación:** https://generadorec.dmarmijosa.com
- **API Docs:** https://generadorec.dmarmijosa.com/api/docs
- **Health Check:** https://generadorec.dmarmijosa.com/api/generator/health
