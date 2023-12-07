FROM nginx:stable-alpine
ADD ./nginx/nginx.conf /etc/nginx/nginx.conf
ADD ./nginx/default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/www/html
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel



COPY ./temp/wannapplay /var/www/html

RUN chown laravel:laravel /var/www/html

# USER laravel
WORKDIR /var/www/html

