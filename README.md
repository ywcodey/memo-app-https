# Memo App in HTTPS
This is a memo app project to show CRUD operation. Node.js, express.js, MongoDB, REST API are used in the project. HTTPS server is used in the project, so the SSL key and certificate should be generated first before starting the app.

## Generate self-signed SSL key and SSL certificate
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./memo.key -out memo.crt`

## Start the app
`npm start`