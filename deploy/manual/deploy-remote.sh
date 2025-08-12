#!/usr/bin/env bash
set -euo pipefail

# Despliegue remoto via SSH en cluster@92.176.33.150:1024
# Requisitos: acceso SSH, Docker y Docker Compose instalados en el remoto
# Uso: ./deploy-remote.sh [/ruta/local/al/repo]

REMOTE_USER=cluster
REMOTE_HOST=92.176.33.150
REMOTE_PORT=1024
REMOTE_DIR=~/generadorec

LOCAL_REPO_DIR=${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}

if [ ! -d "$LOCAL_REPO_DIR" ]; then
  echo "Directorio local inválido: $LOCAL_REPO_DIR" >&2
  exit 1
fi

# Empaquetar solo la carpeta deploy/manual para simplificar
TMP_ARCHIVE=$(mktemp -t generadoec-deploy-XXXXXXXX).tar.gz

trap 'rm -f "$TMP_ARCHIVE"' EXIT

tar -C "$LOCAL_REPO_DIR" -czf "$TMP_ARCHIVE" deploy/manual || {
  echo "Error creando el paquete" >&2
  exit 1
}

# Copiar al servidor
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_DIR"
scp -P "$REMOTE_PORT" "$TMP_ARCHIVE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/deploy.tar.gz"

# Desplegar en el servidor
ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" bash -s <<'EOF'
set -euo pipefail
cd "$HOME/generadorec"
rm -rf deploy && mkdir -p deploy
mv deploy.tar.gz deploy/
cd deploy
mkdir -p manual
cd ..
tar -xzf deploy/deploy.tar.gz -C deploy
cd deploy/manual

# Si existe .env en el HOME o en esta carpeta, Docker Compose lo detectará
# Ejecutar despliegue
if ! command -v docker &>/dev/null; then
  echo "Docker no está instalado en el host remoto" >&2
  exit 1
fi

if ! docker compose version &>/dev/null; then
  echo "Docker Compose V2 no está disponible; intenta con 'docker-compose'" >&2
  if command -v docker-compose &>/dev/null; then
    docker-compose pull || true
    docker-compose up -d
  else
    exit 1
  fi
else
  docker compose pull || true
  docker compose up -d
fi

# Comprobar estado
if command -v curl &>/dev/null; then
  for i in {1..10}; do
    if curl -fsS http://localhost:3000/api/health >/dev/null; then
      echo "App OK"
      exit 0
    fi
    sleep 3
  done
  echo "La app aún no responde en /api/health"
fi
EOF

echo "Despliegue remoto iniciado. Revisa Cloudflare y el dominio generadorec.nexa-code.net"
