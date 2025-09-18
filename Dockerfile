FROM nginx:alpine

COPY raikomusics/dist_web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

