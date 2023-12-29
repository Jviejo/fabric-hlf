// Path: 70_register_enroll/app.js

const FabricCAServices = require("fabric-ca-client")
const { User, Utils } = require("fabric-common")
const fs = require("fs/promises")
const path = require("path")

async function main() {
    console.log("Start")
    const ca = new FabricCAServices("https://org1-ca.localho.st:443")


    const enrollment = await ca.enroll({ enrollmentID: "enroll", enrollmentSecret: "enrollpw" });
    // console.log(enrollment)
    const enroll = await User.createUser(
        "enroll",
        "enrollpw",
        "Org1MSP",
        enrollment.certificate,
        enrollment.key.toBytes()
    )


    const usuario = "user" + Math.floor(Math.random() * 1000)
    const pwd = await ca.register(
        {
            enrollmentID: usuario,
            // enrollmentSecret: "user2pw",
            role: "client",

        },
        enroll
    );

    const enrollment2 = await ca.enroll({
        enrollmentID: usuario,
        enrollmentSecret: pwd,
        profile: "tls"
    });
    //console.log(enrollment2 )


    const usu = await User.createUser(
        usuario,
        pwd,
        "Org1MSP",
        enrollment2.certificate,
        enrollment2.key.toBytes()

    )

    var cryptoSuite = Utils.newCryptoSuite(
        {
            software: true,
            keysize: 256,
            algorithm: "EC",
            hash: "SHA2"
        }
    )
    
    cryptoSuite.setCryptoKeyStore(Utils.newCryptoKeyStore(
        {
            getValue: async (key) => {
                
                console.log("getValue")
                await fs.readFile(path.join(".", ".keystore",`${key}`))
                console.log(key)
            },
            setValue:  async (key, value) => {
                console.log("setValue")
                await fs.writeFile(path.join(".", ".keystore",`${key}`), value)
                console.log(key)
                console.log(value)
            },
        }

    ))
    
    
    const key = await cryptoSuite.generateKey()
    
    //usu.setCryptoSuite(cryptoSuite);
    //const k2 = await cryptoSuite.generateKey({ ephemeral: true })
    


   
    // console.log(sign.toString("base64"))
    // const adminData = await ca.enroll({
    //     enrollmentID: "admin",
    //     enrollmentSecret: "adminpw"
    // })
    // console.log(adminData)
}

main().then(() => {
    console.log("done")
}
).catch((e) => {
    console.log(e)
})
