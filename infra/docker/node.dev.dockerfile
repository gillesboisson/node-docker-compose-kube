FROM docker.io/node:20

RUN mkdir -p /var/app/node_modules

RUN npm install -g lerna

WORKDIR /var/app

RUN chown -R 1000:1000 /var/app
USER 1000:1000

EXPOSE 3000

CMD []

ENTRYPOINT [ "sh", "-c" ]