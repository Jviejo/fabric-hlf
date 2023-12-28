const fs = require('fs');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const req = https.request(
  {
    hostname: 'hola.localho.st',
    port: 8443,
    path: '/',
    method: 'GET',
    cert: fs.readFileSync('./client-cert.pem'),
    key: fs.readFileSync('./client-key.pem'),
    ca: [fs.readFileSync('./ca-cert.pem')],
  },
  res => {
    res.on('data', function(data) {
      console.log(data.toString());
    });
  }
);

req.end();