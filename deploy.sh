#!/usr/bin/env bash
set -euo pipefail


if [ -f Dockerfile ]; then
    echo "Dockerfile found."
    
else
    echo "Error: No Dockerfile found inside the repository."
    ls -la 
    exit 1
fi

echo "Stopping/removing old container if exists..."
docker rm -f raikomusics_container >/dev/null 2>&1 || true

echo "Deleting raikomusics image..."
docker rmi raikomusics

echo "Building New Docker Image..."
docker build -t raikomusics:latest .

echo "Running container on port 6777..."
docker run -d --restart unless-stopped -p 6777:80 --name raikomusics_container raikomusics:latest

HOSTNAMEIP="$(hostname -I | awk '{print $1}')"
echo "RaikoMusics website is available at:"
echo "  http://$HOSTNAMEIP:6777"
echo "  http://localhost:6777"