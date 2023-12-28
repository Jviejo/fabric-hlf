import * as grpc from '@grpc/grpc-js';
import fs from 'fs';
import { load } from 'js-yaml';
import cripto from 'crypto';
import { signers, connect } from '@hyperledger/fabric-gateway'

async function main() {

    const doc = load(fs.readFileSync('../00_hlf_network/org1.yaml', 'utf8'));
    const tlsPem = doc.peers["org1-peer0.default"].tlsCACerts.pem;
    const client = new grpc.Client('peer0-org1.localho.st:443',
        grpc.credentials.createSsl(Buffer.from(tlsPem))
    );

    const identity = {
        mspId: "Org1MSP",
        credentials: Buffer.from(doc.organizations.Org1MSP.users.admin.cert.pem)
    }

    const privateKeyPem = Buffer.from(doc.organizations.Org1MSP.users.admin.key.pem)
    const privateKey = cripto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);


    const gateway = connect({
        client,
        identity,
        signer,
    })

    const channel = await gateway.getNetwork("demo")
    const contract = channel.getContract("cc4", "SmartContract2");

    const results = await contract.evaluate("Ping")
    const r = Buffer.from(results, 'utf8').toString()

    console.log(r)

    const result = await contract.submit('Store', {
        arguments: ['clave', JSON.stringify({ "nombre": "juan antonio andreu", "apellido": "perez perez" })],

    });
    console.log(result.toString())

    const resultget = await contract.evaluate('Get', {arguments:['clave']});
    console.log(Buffer.from(resultget, 'utf8').toString())
}

main().then(() => console.log("ok")).catch(console.error);

