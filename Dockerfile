FROM nginx:alpine

COPY index.html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# # Stage 1: The Forge (Build the web assets)
# FROM node:18-alpine AS builder

# # A true cultivator prepares his tools first.
# # Install Python, make, and a C++ compiler.
# RUN apk add --no-cache python3 make g++

# WORKDIR /usr/src/app

# # Copy only package files first to leverage Docker cache
# COPY raikomusics/package*.json ./raikomusics/
# RUN cd raikomusics && npm install

# # Copy the rest of the electron app source code
# COPY raikomusics/. ./raikomusics/

# # Build the application. This runs webpack and bundles everything.
# RUN cd raikomusics && npm run package


# # Stage 2: The Shrine (Serve the built assets with Nginx)
# FROM nginx:alpine

# # The final bundled code is located within the packaged application resources.
# # This is the corrected path to the treasure.
# ARG BUNDLE_PATH=/usr/src/app/raikomusics/out/raikomusics-linux-x64/resources/app/.webpack/renderer

# # Copy the final bundled assets from the forge to the Nginx web root
# COPY --from=builder ${BUNDLE_PATH} /usr/share/nginx/html

# # Copy your nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]