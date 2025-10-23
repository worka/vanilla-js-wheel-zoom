#!/bin/sh

IMAGE_NAME='vanilla-js-wheel-zoom/image'
CONTAINER_NAME='vanilla-js-wheel-zoom'

LOCAL_DIR="$(pwd)/.."
WORK_DIR='/app'

docker build --tag $IMAGE_NAME .
docker rm -f $CONTAINER_NAME
docker run -itd --volume $LOCAL_DIR:$WORK_DIR --name $CONTAINER_NAME $IMAGE_NAME
docker exec -it --workdir $WORK_DIR $CONTAINER_NAME bash