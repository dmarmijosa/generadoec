# Despliegue manual con Docker + Cloudflared

Este paquete permite desplegar la aplicación sin Kubernetes/ArgoCD, usando solo Docker. Si deseas publicar con Cloudflare Tunnel, gestiona el túnel por fuera de este compose.

Dominios objetivos: generadorec.nexa-code.net (principal) y opcionalmente generadorec.dmarmijosa.com.

## Arquitectura mínima
- Contenedor `app`: imagen unificada que sirve API NestJS y el frontend estático en `/:` y `api/*`.
	(Si usas Cloudflare Tunnel, ejecútalo externo a este compose y apunta al host:3500)

## Requisitos
- Docker y Docker Compose (v2) instalados
- (Opcional) Un túnel de Cloudflare para `generadorec.nexa-code.net` si deseas exponer públicamente. Se gestiona fuera del compose.

## Preparación
1) Clona el repo en el servidor
2) Entra a la carpeta `deploy/manual`
3) Copia `.env.example` a `.env` y rellena `TUNNEL_TOKEN` si usarás modo Token

## Opción A: Usar TUNNEL_TOKEN (más simple) [Predeterminado]
- En Cloudflare, crea un túnel Zero Trust (Cloudflare Tunnel) y copia el Token
- En `.env`, asigna TUNNEL_TOKEN="..."
- El docker-compose ejecuta: `cloudflared tunnel run` con ese token (por defecto)

## Opción B: Configuración declarativa (sin token)
- Crea el túnel y descarga credenciales JSON (p.ej. generadorec-tunnel.json)
- Coloca el JSON en `deploy/manual/cloudflared/generadorec-tunnel.json`
- Ajusta `deploy/manual/cloudflared/config.yml` si cambia el nombre del túnel o hostname
- En docker-compose.yml, comenta el bloque de Token y descomenta el bloque `command --config` + `volumes`

## Variables importantes
- Puerto app interno: 3000 (expuesto en el host también en 3000)
- CORS_ORIGINS ya incluye el dominio nexa-code.net

## Despliegue local en 192.168.1.75
1) Copia el repo a 192.168.1.75
2) Posiciónate en `deploy/manual`
3) Crea `.env` y setea TUNNEL_TOKEN (opción A) o coloca credenciales y ajusta config.yml (opción B)
4) Levanta los servicios:

```bash
docker compose pull && docker compose up -d
```

- App local: http://192.168.1.75:3500
- Dominio público (si configuras túnel externo): https://generadorec.nexa-code.net

## Despliegue remoto por SSH (92.176.33.150:1024)
1) Conéctate al servidor remoto:

```bash
ssh -p 1024 cluster@92.176.33.150
```

2) Clona o actualiza el repo y entra a `deploy/manual`

3) Prepara `.env` o config.yml igual que en el caso local

4) Levanta los servicios:

```bash
docker compose pull && docker compose up -d
```

## Actualizar la versión de la app
- La imagen utilizada está fijada a `dmarmijosa/generadorec:v1.0.11`. Para usar otra versión, edita `deploy/manual/docker-compose.yml`.
- Para aplicar cambios:

```bash
docker compose pull && docker compose up -d
```

## Logs y salud
```bash
docker compose ps
docker compose logs -f app
curl -sf http://localhost:3500/api/generator/health | jq
```

## Notas
- No se requiere Traefik ni Nginx: Cloudflared enruta el dominio directo al contenedor.
- Si necesitas HTTPS directo en el host sin Cloudflare, usa un reverse proxy adicional (no cubierto aquí).
- Asegúrate de tener el dominio `generadorec.nexa-code.net` agregado a tu cuenta de Cloudflare y el túnel asignado a ese hostname.

---

## Publicar con Cloudflare Tunnel (externo)

Si deseas exponer el servicio por Cloudflare Tunnel, ejecútalo de forma independiente en el host (o en otro host), apuntando al origen:
- Origen: http://127.0.0.1:3500 (o http://IP_DEL_HOST:3500)
- Hostname: generadorec.nexa-code.net

Esto mantiene el compose simple y evita acoplar el túnel al ciclo de vida del contenedor.
