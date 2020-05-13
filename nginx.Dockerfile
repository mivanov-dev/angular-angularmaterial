FROM nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/certificates/server.crt /etc/nginx/ssl/server.crt
COPY docker/certificates/server.key /etc/nginx/ssl/server.key
EXPOSE 80 443