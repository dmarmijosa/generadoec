#!/usr/bin/env bash
set -euo pipefail

# Despliegue local en 192.168.1.75 usando Docker Compose
# Requiere: Docker, docker compose, y TUNNEL_TOKEN o config.yml + credenciales

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$SCRIPT_DIR"

echo "==> Pull de imágenes"
docker compose pull || true

echo "==> Levantando contenedores"
docker compose up -d

echo "==> Estado"
docker compose ps

echo "==> Salud de la app (puede tardar unos segundos)"
set +e
for i in {1..10}; do
  if curl -fsS http://localhost:3000/api/generator/health >/dev/null; then
    echo "App OK"
    exit 0
  fi
  sleep 3
done
echo "La app aún no responde en /api/generator/health; revisa logs con 'docker compose logs -f app'"
exit 1
