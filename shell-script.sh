echo "INSIDE SHELL SCRIPT"
#!/bin/bash

# Query Docker Hub API to get the latest tag
mongo_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-mongo/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)
node_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-node/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)
next_latest_tag=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-next/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)

# Replace image tag in Kubernetes YAML with the latest tag
sed -i "s|image: dhairyadockerhub/ad-next:.*$|image: dhairyadockerhub/ad-next:$mongo_latest_tag|" ad-mongo-kub.yml
sed -i "s|image: dhairyadockerhub/ad-next:.*$|image: dhairyadockerhub/ad-next:$node_latest_tag|" ad-node-kub.yml
sed -i "s|image: dhairyadockerhub/ad-next:.*$|image: dhairyadockerhub/ad-next:$next_latest_tag|" ad-next-kub.yml

# Apply updated YAML to Kubernetes cluster
kubectl apply -f ad-mongo-kub.yml
kubectl apply -f ad-node-kub.yml
kubectl apply -f ad-next-kub.yml
