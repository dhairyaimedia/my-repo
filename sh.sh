
output=$(curl -s "https://registry.hub.docker.com/v2/repositories/dhairyadockerhub/ad-next/tags/" | jq -r '.results[].name | select(test("^[0-9]+$")) | tonumber' | sort -rn | head -n1)

echo "$output"
