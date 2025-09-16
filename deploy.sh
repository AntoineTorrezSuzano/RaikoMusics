#!/usr/bin/env bash
set -euo pipefail

echo "Bringing down old services (if running)..."
# -v flag is to take down the volumes
docker-compose down -v

echo "Building new Docker images..."
docker-compose build --no-cache

echo "Launching de Shrine the Melodies..."
docker-compose up -d  ##Error to --no-cache

echo "Cleaning up dangling images..."
docker image prune -f

HOSTNAMEIP="$(hostname -I | awk '{print $1}')"
echo "RaikoMusics is now operational:"
echo "  - Frontend is available at http://$HOSTNAMEIP:6777 and http://localhost:6777"
echo "  - Stream Server is available at http://$HOSTNAMEIP:6888 and http://localhost:6888"

