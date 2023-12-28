# # remove the code.tar.gz chaincode.tgz if they exist
# rm code.tar.gz chaincode.tgz
export CHAINCODE_NAME=mycc
export CHAINCODE_LABEL=mycc
export ORG1=../00_hlf_network/org1.yaml
cat << METADATA-EOF > "metadata.json"
{
    "type": "ccaas",
    "label": "${CHAINCODE_LABEL}"
}
METADATA-EOF
## chaincode as a service
cat > "connection.json" <<CONN_EOF
{

  "address": "chaincode.dev:9999",
  "dial_timeout": "10s",
  "tls_required": false
}
CONN_EOF

tar cfz code.tar.gz connection.json
tar cfz chaincode.tgz metadata.json code.tar.gz
export PACKAGE_ID=$(kubectl hlf chaincode calculatepackageid --path=chaincode.tgz --language=node --label=$CHAINCODE_LABEL)
echo "PACKAGE_ID=$PACKAGE_ID"

kubectl hlf chaincode install --path=./chaincode.tgz \
    --config=$ORG1 --language=golang \
    --label=$CHAINCODE_LABEL \
    --user=admin --peer=org1-peer0.default

kubectl hlf chaincode install --path=./chaincode.tgz \
    --config=$ORG1 --language=golang --label=$CHAINCODE_LABEL \
    --user=admin --peer=org1-peer1.default

export SEQUENCE=1
export VERSION="1.0"

kubectl hlf chaincode approveformyorg \
    --config=$ORG1 --user=admin \
    --peer=org1-peer0.default \
    --package-id=$PACKAGE_ID \
    --version "$VERSION" --sequence "$SEQUENCE" --name=$CHAINCODE_NAME \
    --policy="OR('Org1MSP.member')" --channel=demo

kubectl hlf chaincode commit --config=$ORG1 --user=admin --mspid=Org1MSP \
    --version "$VERSION" --sequence "$SEQUENCE" --name=$CHAINCODE_NAME \
    --policy="OR('Org1MSP.member')" --channel=demo

