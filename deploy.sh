#!/usr/bin/env bash
set -euo pipefail


if [ -f Dockerfile ]; then
    echo "Dockerfile found."
    
else
    echo "Error: No Dockerfile found inside the repository."
    ls -la 
    exit 1
fi
echo "Building Docker Image..."
docker build -t raikomusic:latest .

echo "Stopping/removing old container if exists..."
docker rm -f raikomusic_container >/dev/null 2>&1 || true

echo "Running container on port 6777..."
docker run -d --restart unless-stopped -p 6777:80 --name raikomusic_container raikomusic:latest

HOSTNAMEIP="$(hostname -I | awk '{print $1}')"
echo "RaikoMusic website is available at:"
echo "  http://$HOSTNAMEIP:6777"
echo "  http://localhost:6777"