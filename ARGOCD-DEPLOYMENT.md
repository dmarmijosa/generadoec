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

**Para producción:**
- Configurar el dominio `generadorec.dmarmijosa.com` para apuntar a la IP del Ingress Controller

**Para desarrollo/testing:**
```bash
# Obtener la IP del Ingress
kubectl get ingress -n generadorec

# Agregar a /etc/hosts (local)
echo "<INGRESS_IP> generadorec.dmarmijosa.com" >> /etc/hosts
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

#### 4. Problemas de certificados
```bash
# Verificar cert-manager
kubectl get clusterissuer

# Verificar challenge
kubectl describe certificate generadorec-tls -n generadorec
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
