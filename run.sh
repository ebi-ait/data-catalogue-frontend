#!/bin/sh -vxe
DOCKER_TAG="$(date '+%Y%m%d-%H%M')"
DOCKER_IMAGE_NAME=data-catalogue-demo
DOCKER_REPO=dockerhub.ebi.ac.uk/fairification
DOCKER_IMAGE_TAG=$DOCKER_REPO/$DOCKER_IMAGE_NAME:$DOCKER_TAG
CATALOGUE_NAME=demo

docker build --tag "$DOCKER_IMAGE_TAG" --push .
cd k8s/overlays/${CATALOGUE_NAME}
kustomize edit set image $DOCKER_IMAGE_NAME=$DOCKER_IMAGE_TAG
cd -
kubectl apply -k k8s/overlays/${CATALOGUE_NAME}
kubectl rollout restart \
  deployments data-catalogue-${CATALOGUE_NAME} \
  --namespace "$(yq '.namespace' k8s/overlays/${CATALOGUE_NAME}/kustomization.yaml)"
kubectl wait --namespace dc-${CATALOGUE_NAME} --for=condition=ready pod --selector=app=data-catalogue-${CATALOGUE_NAME} --timeout=60s

curl https://wwwdev.ebi.ac.uk/catalogue/${CATALOGUE_NAME}/config.js

