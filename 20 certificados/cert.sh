# https://dev.to/techschoolguru/a-complete-overview-of-ssl-tls-and-its-cryptographic-system-36pd
# sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/fabric-hlf/certificados/ca-cert.pem 
# security find-certificate -a -p
# https://sadique.io/blog/2012/06/05/managing-security-certificates-from-the-console-on-windows-mac-os-x-and-linux/

rm *.pem

# 1. Generate CA's private key and self-signed certificate
openssl req -x509 \
-newkey rsa:4096 \
-days 365 -nodes \
-keyout ca-key.pem -out ca-cert.pem \
-subj "/C=SP/L=ALICANTE/O=kungfusoftware/OU=Education/CN=ca/emailAddress=jviejo@gmail.com"

# 2. Generate web server's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 \
-nodes -keyout server-key.pem -out server-req.pem \
-subj "/C=SP/L=ALICANTE/O=UTIL SOFTWARE/OU=Computer/CN=hola.localho.st/emailAddress=web.server@gmail.com" \
-addext "subjectAltName = DNS:localhost  DNS:hola.localho.st" \

# 3. Use CA's private key to sign web server's CSR and get back the signed certificate
openssl x509 -req -in server-req.pem -days 60 -CA ca-cert.pem -CAkey \
ca-key.pem  -out server-cert.pem 

# 4. Generate client's private key and certificate signing request (CSR)
openssl req -newkey rsa:4096 \
-nodes -keyout client-key.pem -out client-req.pem \
-subj "/C=SP/L=ALICANTE/O=CLIENTE/OU=Computer/CN=12245566 VIEJO HUERTA/emailAddress=cliente@gmail.com"

# 5. Use CA's private key to sign client's CSR and get back the signed certificate
openssl x509 -req -in client-req.pem -days 60 \
-CA ca-cert.pem -CAkey ca-key.pem  \
-out client-cert.pem 

