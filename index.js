const fs=require("fs");
const express= require('express');
const app=express();

//HTTP GET POST PUT DELETE
/*
get"/"
get "/obtenerPartidas"
post get "/agregarUsuario/:nick"
put "/actualizarPartida"
delete "/eliminarPartida"
...
*/

app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});

//Start the server
const PORT =process.env.port1 || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


//npm update
//node index.js
//npm install express
//npm init
////npm install express --save para que te cree el paquete json
//git add .
//git del .
//git add.
// git push