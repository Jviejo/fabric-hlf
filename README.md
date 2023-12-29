# Directorios
## 00_hlf_network
### Red construida con https://github.com/hyperledger/bevel-operator-fabric
## 10_conexion
### programa para conexion a fabric 
## 20_creacion de certificados con openssl
## 30_first_programa 
### Programa de conexion realizado en video
## 40_CC
### Chaincode 
## 50_webserver
### Programa para mostrar como funciona ngrok
## 60_CC1
### Chaincode realizado en el video
### Dockerfile para crear imagen de chaincode
```sh
# creat imagen y subirla a docker hub
docker build . -t jviejo/cc3:0.0.1   
docker push jviejo/cc3:0.0.1  

# Desplegar en docker
docker run -p 8888:8888 \   
 -e chaincode-address=0.0.0.0:8888 \
 -e chaincode-id=cc3:2082d0e4d9fb9fd8bf74e0faf24041b0606c27aed1aa24337ae108c649eff4f5 \
 jviejo/cc1:0.0.1 

# desplegar en kubernetes
kubectl hlf externalchaincode sync --image=jviejo/cc3:0.0.1 \
    --name=$CHAINCODE_NAME \
    --namespace=default \
    --package-id=$PACKAGE_ID \
    --tls-required=false \
    --replicas=1
```




