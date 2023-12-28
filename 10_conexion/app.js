// para conexion grpc
import * as grpc from '@grpc/grpc-js';
// para interacturar con fabric
import pkg from '@hyperledger/fabric-gateway';
// conectar y crear un firmador
const { connect, signers } = pkg;
// para crear la clave privada del firmador
import cripto from 'crypto';
// para leer el archivo de configuracion
import fs from 'fs';
// usamos js-yaml para cargar el archivo de configuracion
import pkg2 from 'js-yaml';
const {load} = pkg2;


async function main() {
    // cargo la configuracion de la red
    const doc = load(fs.readFileSync('../00_hlf_network/org1.yaml', 'utf8'));
    // console.log('doc', doc)
    const tlsPem = doc.peers["org1-peer0.default"].tlsCACerts.pem
    // creo la conexion grpc
    const client = await  new grpc.Client('peer0-org1.localho.st:443',
        grpc.credentials.createSsl(Buffer.from(tlsPem)),
    );
   
    console.log(doc.organizations.Org1MSP.users.admin.cert.pem)
    // creo la identidad 
    const identity = {mspId: "Org1MSP", 
        // importante: el certificado debe ser un buffer
         credentials: Buffer.from(doc.organizations.Org1MSP.users.admin.cert.pem)};
    // usamos la private key.
    const privateKeyPem = doc.organizations.Org1MSP.users.admin.key.pem
    const privateKey = cripto.createPrivateKey(privateKeyPem);
    const signer =  await signers.newPrivateKeySigner(privateKey);
    const gateway = await connect({
        identity: identity,
        signer: signer,
        client: client,
        
    })
    // obtenemos el contrato a traves del canal
    const network = await gateway.getNetwork('demo');
    const contract = await network.getContract('asset');
    // hacemos la invocacion
    const resultBytes = await contract.evaluate('GetAllAssets',[]);
    const resultString = Buffer.from(resultBytes, 'utf-8').toString();
    console.log('resultString', resultString)
}   
main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log('Final error checking', e);
});
