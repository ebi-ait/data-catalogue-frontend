#!/bin/sh -vxe
DOCKER_TAG="$(date '+%Y%m%d-%H%M')"
DOCKER_IMAGE_NAME=data-catalogue-demo
DOCKER_REPO=dockerhub.ebi.ac.uk/fairification
DOCKER_IMAGE_TAG=$DOCKER_REPO/$DOCKER_IMAGE_NAME:$DOCKER_TAG

docker build --tag "$DOCKER_IMAGE_TAG" --push .
cd k8s/overlays/demo
kustomize edit set image $DOCKER_IMAGE_NAME=$DOCKER_IMAGE_TAG
cd -
kubectl apply -k k8s/overlays/demo
kubectl rollout restart deployments data-catalogue-demo
curl https://wwwdev.ebi.ac.uk/catalogue/demo/config.js
