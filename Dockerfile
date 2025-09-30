FROM nginx:alpine

COPY web/index.html /usr/share/nginx/html
COPY web/deletePage.html /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]