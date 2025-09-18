# FROM nginx:alpine

# COPY raikomusics/dist_web /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory for the whole app
WORKDIR /app

# Copy your entire build output folder into the container
COPY raikomusics/dist_web/ ./dist_web/

# IMPORTANT: Change the working directory INTO the folder with your server
WORKDIR /app/dist_web

# Install production dependencies from the package.json inside dist_web
RUN npm install --production

# Expose port 80
EXPOSE 80

# Command to run the Node.js server from the current directory (/app/dist_web)
CMD ["node", "server.js"]