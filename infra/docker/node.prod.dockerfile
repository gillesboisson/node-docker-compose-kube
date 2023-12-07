FROM docker.io/node:20
ARG APP_NAME

RUN export NODE_ENV=development

RUN mkdir -p /var/app/node_modules

RUN npm install -g lerna

WORKDIR /var/app

COPY package.json yarn.lock lerna.json /var/app/
COPY ./apps/${APP_NAME} /var/app/apps/${APP_NAME}
COPY ./libs /var/app/libs


RUN yarn install --frozen-lockfile --non-interactive --production=false
RUN yarn && yarn build



RUN chown -R 1000:1000 /var/app
USER 1000:1000

RUN export NODE_ENV=production

WORKDIR /var/app/apps/${APP_NAME}

EXPOSE 3000

CMD []

ENTRYPOINT [ "yarn", "start" ]