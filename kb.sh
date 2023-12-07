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
IMAGE_BASE_TAG="gillesboisson/node-refresh-"
KB_NAMESPACE="app"
KB_DIR="${INFRA_DIR}/k8s"

ENV=${2:-"dev"}



#WP_PROJECT_LINK="../wannaplay"

echo "--- environment: $ENV"
echo ""



build_image(){
    name=$2

    # if no name throw error
    if [ -z "$name" ]
    then
        echo "Error: no name provided"
        exit -1
    fi

    version=$3
    # if empty, use latest
    if [ -z "$version" ]
    then
        version="latest"
    fi



    $(which docker) build $4 -t "${IMAGE_BASE_TAG}${name}-${ENV}:${version}" --build-arg "APP_NAME=${name}" -f "${INFRA_DIR}/docker/node.${ENV}.dockerfile" ./
}

push_image(){
    name=$2

    # if no name throw error
    if [ -z "$name" ]
    then
        echo "Error: no name provided"
        exit -1
    fi

    version=$3
    # if empty, use latest
    if [ -z "$version" ]
    then
        version="latest"
    fi

    $(which docker) push "${IMAGE_BASE_TAG}${name}-${ENV}:${version}"
}

update_images(){
    version=$2
    # if empty, use latest
    if [ -z "$version" ]
    then
        version="latest"
    fi

    build_image $ENV "web" "$version" $3 
    build_image $ENV "worker" "$version" $3

    push_image $ENV "web" "$version"
    push_image $ENV "worker" "$version" 
}

kb(){
    if [ -z "$1" ]
    then
        echo "Error: no command provided"
        exit -1
    fi

    if [ $ENV == "dev" ]
    then
        $(which minikube) kubectl -- -n $KB_NAMESPACE "$@"
    else
        $(which kubectl) -n $KB_NAMESPACE "$@"
    fi

   
}

start(){
    kb apply -f $KB_DIR/redis
    kb apply -f $KB_DIR/postgres
    kb apply -f $KB_DIR/node
}

stop(){
    kb -n app delete --all  deployments
    kb -n app delete --all  statefulsets
    kb -n app delete --all  services 
}

prune(){
    stop
    kb -n app delete --all  pvc
    kb -n app delete --all  pv
}

dev_proxy(){
    minikube service -n app --url node-web
}


# if no method provided display doc
if [ $# -eq 0 ];
  then
    echo "No arguments supplied"
    echo "Usage: ./dc.sh <command> <env>"
else
  "$@"
fi
