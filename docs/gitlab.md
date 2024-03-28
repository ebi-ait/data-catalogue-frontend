## CICD With GitLab

The project is mirrored in EBI Gitlab instance and set up to pull every {X} minutes. 
The {branch} is set up to build and push the image to the container registry. Build and publishing to container registry will be triggered automatically. K8s deployment is set up to manually trigger. 
See `gitlab-ci.yml` file for CI/CD configuration.  


### Setting up:
1. Create a deploy token for container registry in GitLab `Settings -> Repository -> Deploy Tokens`. Make sure the deploy token has appropriate permission. Use the generated to deploy token in following steps. 

2. Setup required variables in GitLab `Settings -> CI/CD -> Variables`
   - CI_REGISTRY_USER - Container registry user
   - CI_REGISTRY_PASSWORD - Container registry user password

3. Upload/configure secure files in Gitlab `Settings -> CI/CD -> Secure Files`
   - .dockerconfig.json - Container registry auth config. Could be found under `$PROJECT_HOME/k8s/overlays/<project>`
   - config - k8s config file. Could be found under `~/.kube/`

### Secure File Templates
`$PROJECT_HOME/k8s/overlays/demo`
```json
{
  "auths": {
    "dockerhub.ebi.ac.uk": {
      "username": "$CI_REGISTRY_USER",
      "password": "$CI_REGISTRY_PASSWORD"
    }
  }
}
```

`~/.kube/config`
```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: $K8_HX_CERTIFICATE_AUTHORITY_DATA
    server: $K8_HX_SERVER
  name: ena-cluster
contexts:
- context:
    cluster: ena-cluster
    namespace: dc-demo-dev
    user: ena-admin
  name: dc-demo
current-context: dc-demo
kind: Config
preferences: {}
users:
- name: ena-admin
  user:
    token: $K8_HX_USER_TOKEN

```
