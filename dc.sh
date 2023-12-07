#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# GIT_REPO=git@gitlab.com:gilles1/node_refresh.git

set -e
if [ ! -d "${SCRIPT_DIR}" ]
  then echo "Error: Script directory(${SCRIPT_DIR}) does not exist";
  exit -1;
fi;

ROOT_DIR="${SCRIPT_DIR}"
WP_DIR="${SCRIPT_DIR}/node_refresh"
INFRA_DIR="${SCRIPT_DIR}/infra"
DC_SIR="${INFRA_DIR}/dc"
ENV_DIR="${INFRA_DIR}/docker/env"
BACKUP_DIR="${SCRIPT_DIR}/backups"
VOLUMES_DIR="${INFRA_DIR}/volumes"



ENV=${2:-"dev"}

#WP_PROJECT_LINK="../wannaplay"

echo "--- environment: $ENV"
echo ""


start(){
    start_dbs_and_wait $ENV
    dc $ENV up -d web
}

prepare_for_local_node_dev(){
  yarn
  yarn build:dev
  start_dbs_and_wait $ENV
  load_env_all_export $ENV
  export DB_HOST="127.0.0.1"
  export REDIS_HOST="127.0.0.1"
  set +o allexport
}

start_node_dev(){
    
    app=$2
    if [ -z "$app" ]
    then
      app=web
    fi
    # if $3 empty and $app is a worker throw error
    if [ -z "$3" ] && [ "$app" == "worker" ]
    then
      echo "Error: worker name is required"
      exit -1
    fi

    workers=$3
    
    export APP_WORKERS=$workers
    
    prepare_for_local_node_dev $ENV
    yarn ${app}:start:dev
}


wait_for(){
  dc $ENV run --rm -e "DOMAIN=$1" -e "PORT=$2" wait-for
}

stop(){
    dc $ENV down
}


# docker compose wrapper
# dc <env> <command>
dc(){
  export ROOT_DIR="${SCRIPT_DIR}"
  export ENV="${ENV}"
  $(which docker) compose -f $DC_SIR/docker-compose.common.yml -f $DC_SIR/docker-compose.${1}.yml --env-file "${ENV_DIR}/env.${ENV}" "${@: 2}"
}


# create volumes sub directory
# create_volumes_dir
create_volumes_dir(){
  mkdir if not exists
  mkdir -p $VOLUMES_DIR/db/dumps
}


# $1 filename to source for environment variables
_load_env() {
  set -a
  source "${ENV_DIR}/env.$1"
  set +a
}

# Export envirnoment as all export for local development
# $1 filename to source for environment variables
load_env_all_export(){
  set -o allexport
  export ROOT_DIR="${SCRIPT_DIR}" 
  source "${ENV_DIR}/env.$1"
 
}


start_dbs_and_wait(){
  _load_env $ENV

  if [ "$ENV" != "prod" ]; then
    dc $ENV up -d db
    dc $ENV up -d redis

    wait_for $DB_HOST $DB_PORT
    wait_for $REDIS_HOST $REDIS_PORT
    # redis no wait for now    
  fi
}

# if no method provided display doc
if [ $# -eq 0 ];
  then
    echo "No arguments supplied"
    echo "Usage: ./dc.sh <command> <env>"
else
  "$@"
fi

