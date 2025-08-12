# Despliegue manual con Docker + Cloudflared

Este paquete permite desplegar la aplicación sin Kubernetes/ArgoCD, usando solo Docker y un túnel de Cloudflare.

Dominios objetivos: generadorec.nexa-code.net (principal) y opcionalmente generadorec.dmarmijosa.com.

## Arquitectura mínima
- Contenedor `app`: imagen unificada que sirve API NestJS y el frontend estático en `/:` y `api/*`.
- Contenedor `cloudflared`: expone el servicio públicamente en Cloudflare y enruta el dominio al contenedor `app`.

## Requisitos
- Docker y Docker Compose (v2) instalados
- Un túnel de Cloudflare válido para `generadorec.nexa-code.net` (puedes usar Token o config.yml + credenciales)

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

- App local: http://192.168.1.75:3000
- Dominio público: https://generadorec.nexa-code.net (vía Cloudflared)

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
docker compose logs -f cloudflared
curl -sf http://localhost:3000/api/generator/health | jq
```

## Notas
- No se requiere Traefik ni Nginx: Cloudflared enruta el dominio directo al contenedor.
- Si necesitas HTTPS directo en el host sin Cloudflare, usa un reverse proxy adicional (no cubierto aquí).
- Asegúrate de tener el dominio `generadorec.nexa-code.net` agregado a tu cuenta de Cloudflare y el túnel asignado a ese hostname.

---

## Guía rápida para crear el túnel Cloudflare

Puedes hacerlo de dos formas. La más sencilla es por Token.

### A) Método Token (recomendado y por defecto)
1. En el panel de Cloudflare Zero Trust, crea un Tunnel nuevo.
2. Elige la opción de Docker y copia el Token (formato largo). También puedes descargar un YAML de ejemplo.
3. En este repo, crea el archivo `.env` en `deploy/manual` con:

```
TUNNEL_TOKEN=pega_aqui_tu_token
```

4. Levanta el stack (local o remoto). El servicio `cloudflared` usará ese Token y registrará el túnel.
5. En la sección de “Public Hostnames” del túnel, crea un hostname `generadorec.nexa-code.net` apuntando a `http://app:3000`.

### B) Método Declarativo (config.yml + credencial JSON)
1. Crea el túnel desde tu máquina con `cloudflared` instalado:
	- `cloudflared tunnel login`
	- `cloudflared tunnel create generadorec-tunnel`
	Esto generará un archivo de credenciales JSON.
2. Descarga el archivo de credenciales JSON y cópialo a `deploy/manual/cloudflared/generadorec-tunnel.json`.
3. Edita `deploy/manual/cloudflared/config.yml` y ajusta si es necesario:
	- `tunnel: generadorec-tunnel`
	- `credentials-file: /etc/cloudflared/generadorec-tunnel.json`
	- `ingress` con:
	  - `hostname: generadorec.nexa-code.net`
	  - `service: http://app:3000`
4. En `deploy/manual/docker-compose.yml`, comenta el bloque de Token y descomenta:
	- `command: tunnel --no-autoupdate --config /etc/cloudflared/config.yml run`
	- `volumes: - ./cloudflared:/etc/cloudflared:ro`
5. Levanta el stack. El contenedor `cloudflared` leerá la config y conectará el túnel.
