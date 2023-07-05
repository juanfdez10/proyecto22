// es el API Rest
const fs = require('fs');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require('./servidor/modelo.js');
const sWS = require('./servidor/servidorWS.js');

const PORT = process.env.PORT || 3000; // Util para el despliegue process.env.PORT por si el OS tiene una variable definida
var args = process.argv.slice(2);

//args[0]
let juego = new modelo.Juego(false); // Conectamos API REST con la capa logica (index.js --> modelo.js)
let servidorWS = new sWS.ServidorWS();

const passport = require('passport');
require("./servidor/passport-setup.js");
const cookieSession=require("cookie-session");


//ERROR 401


/*  http get post put delete (se llaman verbos)
    get "/"
    get "/obtenerPartidas"
    post "/agregarUsuario/:nick" post para enviar mucha informacion
    put "/actualizarPartida"     get si envias poca informacion
    delete "/eliminarPartida"   
    ... etc
    Son las distintas rutas con los parametros que requiera la logica
*/
// app.get('/', (req, res) => { 
//   res
//     .status(200)
//     .send("Hola")
//     .end();
// });

app.use(express.static(__dirname + "/"));
app.use(cookieSession({
  name: 'Batalla naval',
  keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (request, response) {
  let contenido = fs.readFileSync(__dirname + "/cliente/index.html"); // lectura bloqueante
  response.setHeader("Content-type", "text/html");
  response.send(contenido);
});



app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/fallo' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
});


app.get("/good", function(request,response){
  var nick=request.user.emails[0].value;
  if (nick){
    juego.agregarUsuario(nick,true);
  }
  response.cookie('nick',nick);
  response.redirect('/');
});

app.get("/fallo",function(request,response){
  response.send({nick:"nook"})
})





//estrategia local
///auth/plataforma(twitter,github)
//


// en funcion de como se llama en la logica, tmbn tener en cuenta parametros
app.get("/agregarUsuario/:nick", function (request, response) {
  let nick = request.params.nick; // recuperamos parametro de la ruta agregarUsuario
  let res;
  res = juego.agregarUsuario(nick,false); // este res se llama data en clienteRest.js
  response.send(res); // Siempre responder para no evitar timeouts y cosas raras

  // En la capa REST se evita poner logica, esto se debe hacer en la capa logica
});

app.get("/comprobarUsuario/:nick", function (request, response) {
  let nick = request.params.nick;
  let us = juego.obtenerUsuario(nick);
  let res = { "nick": -1 };
  if (us) {
    res.nick = us.nick;
  }
  response.send(res);
})


app.get('/crearPartida/:nick', function (request, response) {
  let nick = request.params.nick;
  let res = juego.jugadorCreaPartida(nick);
  response.send(res);
});

app.get("/unirseAPartida/:nick/:codigo", function (request, response) {
  let nick = request.params.nick;
  let codigo = request.params.codigo;
  let res = juego.jugadorSeUneAPartida(nick, codigo);
  response.send(res);
});

app.get('/obtenerPartidas', function (request, response) {
  let res = juego.obtenerPartidas();
  response.send(res);
});

app.get('/obtenerPartidasDisponibles', function (request, response) {
  let res = juego.obtenerPartidasDisponibles();
  response.send(res);
});

app.get('/salir/:nick', function (request, response) {
  let nick = request.params.nick;
  juego.usuarioSale(nick);
  response.send({res:"ok"});
});

//app.get('/obtenerLogs', function (request, response) {
//  juego.obtenerLogs(function (logs){
//    response.send(logs)
//  })
//});

app.get("*",(req,res) =>{
  res.sendFile(__dirname + "/cliente/404.html")
})


server.listen(PORT, () => {
  console.log(`Aplicacion escuchando en puerto ${PORT}`);
  console.log('Ctrl+C para salir');
});

servidorWS.lanzarServidorWS(io, juego)

//CMD Y NODE abiertos
//npm update
//node index.js
//npm install express
//npm init
////npm install express --save para que te cree el paquete json
//git add .
//git del .
//git add.
//git push
//git commit -m "mensaje"

//node index.js
//git add .
//git push
//git commit -m "mensaje"

//HTTP GET POST PUT DELETE
/*
get"/"
get "/obtenerPartidas"
post get "/agregarUsuario/:nick"
put "/actualizarPartida"
delete "/eliminarPartida"
...
*/

/*
app.get('/', (req, res) => {
  res
    .status(200)
    .send("Hola")
    .end();
});

/*
npm start
nom install socket.io


git branch
*/