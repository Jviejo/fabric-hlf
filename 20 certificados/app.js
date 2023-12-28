//archivo index.js
var express = require('express');
var fs = require('fs');
var https = require('https');
var app = express();

const PUERTO = 8443;

https.createServer({
   cert: fs.readFileSync('./server-cert.pem'),
   key: fs.readFileSync('./server-key.pem'),
   // poner la ca.pem en el arreglo
   ca: [fs.readFileSync('./ca-cert.pem')],

   requestCert: true,
   

 },app).listen(PUERTO, function(){
	console.log(`Servidor https correindo en el puerto ${PUERTO}`);
});

app.get('/', function(req, res){
     const certificate = req.socket.getPeerCertificate();
     console.log(certificate.subject);
	res.send('Hola de muevo');
	console.log('Se recibio una petición get a través de https');
});