export CHAINCODE_NAME=cc10 
export PACKAGE_ID=cc10:00381b12f4701845385d1d5f2fc91d9aa14d60c1a5632e58dcf71e7a8a2a01a7
kubectl hlf externalchaincode sync --image=jviejo/cc10:0.0.1 \
    --name=$CHAINCODE_NAME \
    --namespace=default \
    --package-id=$PACKAGE_ID \
    --tls-required=false \
    --replicas=1
    