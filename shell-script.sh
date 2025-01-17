echo "INSIDE SHELL SCRIPT"
#!/bin/bash

# Query Docker Hub API to get the latest tag
mongo_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-mongo/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)
node_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-node/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)
next_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-next/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)

# Replace image tag in Kubernetes YAML with the latest tag
sed -i "s|image: dhairyadockerhub/ad-mongo:.*$|image: dhairyadockerhub/ad-mongo:$mongo_latest_tag|" ad-mongo-kub.yml
sed -i "s|image: dhairyadockerhub/ad-node:.*$|image: dhairyadockerhub/ad-node:$node_latest_tag|" ad-node-kub.yml
sed -i "s|image: dhairyadockerhub/ad-next:.*$|image: dhairyadockerhub/ad-next:$next_latest_tag|" ad-next-kub.yml

# Apply updated YAML to Kubernetes cluster
# kubectl delete service advance-mongodb-service
# kubectl delete service advance-nodejs-service
# kubectl delete service advance-nextjs-service

kubectl apply -f ad-mongo-kub.yml
kubectl apply -f ad-node-kub.yml
kubectl apply -f ad-next-kub.yml
