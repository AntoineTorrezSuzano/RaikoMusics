FROM nginx:1.29.1-alpine

COPY musicstream.conf /etc/nginx/conf.d/default.conf

COPY Audios/* /var/www/music

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]