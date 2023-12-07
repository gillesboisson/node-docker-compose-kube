# Node refresh

Implementation test of node app using express and bee-queue. This is multi package app with a shared library using lerna.
Infrastructure is managed by docker-compose or kubernetes.

This repo is for experimentation and learning purpose. It is not production ready, but it illustrate general architecture for scalable node app.



## JS App

App is developed on node 18+ and uses typescript. it has an node express app (API) and worker app (Bee-Queue processors) that can be clustered. The app use postgres (Sequelize) as database and redis for queues. 

- apps are in folder [./apps](./apps)
- shared libs are in folder [./libs](./libs)

!! Typescript config is not environment aware. Even for production build, it use dev profile (source maps, etc). 
!! It is pure TSC build pipeline, Webpack or other bundler is advised for production build.
!! Model sequelize migration process is in place. SQL based migration is advised for maintenance purpose.

### development

In root directory

```bash
yarn install

# build all apps and there local dependencies
yarn build
# or
yarn build:dev


# API
./dc.sh start_node_dev dev web

# WORKERS
./dc.sh start_node_dev dev worker MY_QUEUE,MY_OTHER_QUEUE

# or directly

./dc.sh prepare_for_local_node_dev dev # will install dependencies, build, setup env and start redis and postgres

yarn web:start:dev # remove :dev will just remove code watcher
# or
export APP_WORKERS=MY_QUEUE
yarn worker:start:dev # remove :dev will just remove code watcher


```
App is available on http://localhost:3000



### Docker compose

A docker compose infracture is available for development and production. Config is availabe on infra/dc. And a cli is available on root directory `./dc.sh` to manage the docker compose.

```bash

./dc.sh action_name ENV [other_args] 

./dc.sh start dev # start running app in dev mode
./dc.sh stop dev # stop running app 

./dc.sh dc dev up -d redis postgres # docker compose command. eg here : docker compose up -d redis postgres
```

Config is available as environment variables in `infra/docker/env.[env] (eg infra/docker/env.dev)

### Kubernetes

A kubernetes infracture is available for development. Config is availabe as kube configMap on ./infra/k8s/[service]/config.yaml. And a cli is available on root directory `./kb.sh` to manage the kubernetes.

For now all services are deployed on the same namespace (app). image is built locally and pushed to docker hub

It will use minikube on dev env.

```bash
./kb.sh action_name ENV [other_args]

./kb.sh start dev
./kb.sh stop dev

./kb.sh prune dev # stop and delete all resources

# dev only 

./kb.sh dev_proxy dev
# will start minikube proxy and output exposed api url
```

## License
The MIT License (MIT)

Copyright (c) 2023-present Gilles Boisson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.