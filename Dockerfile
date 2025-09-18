# FROM nginx:alpine

# COPY index.html /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy the static website assets from your Electron app's renderer code.
COPY ./raikomusics/src /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]