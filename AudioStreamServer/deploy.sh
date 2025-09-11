#!/usr/bin/env bash
set -euo pipefail

TAG=$(git rev-parse --short HEAD)

if [ -f Dockerfile ]; then
    echo "Dockerfile found."
    
else
    echo "Error: No Dockerfile found inside the repository."
    ls -la 
    exit 1
fi

echo "Stopping old container if is running..."
docker stop raikomusics_stream_container >/dev/null 2>&1 || true

echo "Removing old container if it exist..."
docker rm raikomusics_stream_container >/dev/null 2>&1 || true

echo "Building New Docker Image..."
docker build -t raikomusics_stream:$TAG .

echo "Running container on port 6888..."
docker run -d --restart unless-stopped -p 6888:8080 --name raikomusics_stream_container raikomusics_stream:$TAG

echo "Cleaning up dangling images..."
docker image prune -f


HOSTNAMEIP="$(hostname -I | awk '{print $1}')"
echo "RaikoMusics stream server is available at:"
echo "  http://$HOSTNAMEIP:6888"
echo "  http://localhost:6888"