#!/bin/bash

# Construct Docker configuration JSON
docker_config="{\"auths\":{\"$IMAGE_REPO_BASE_DOMAIN\":{\"auth\":\"(echo -n $IMAGE_REPO_USERNAME:$IMAGE_REPO_PASSWORD | base64)\"}}}"

export DOCKER_CONFIG_JSON=$(echo -n $docker_config | base64)

envsubst < serviceaccount.yaml | kubectl apply --namespace=${K8S_NAMESPACE} -f -
