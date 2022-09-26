
function Juego(){
	this.partidas={};
	this.usuarios={};//array asociativo
	
	this.agregarUsuario=function(nick){
		if(!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick,this);
		}
	}

	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];

	}	
	this.crearPartida=function(nick){
		//obtener codigo unico
		//crear partida con propietario nick
		//devolver el codigo
		console.log("partida creada");
	}



//	this.agregarPartida=function(nombre){
//		this.partidas.push(new Partida(nombre))
//	}
//	this.eliminarPartida=function(nombre){
//	//TODO
//	}
}

function Usuario(nick,juego){
	this.nick=nick;
	thia.juego=juego;
	this.crearPartida=function(){
		this.juego.crearPartida(this.nick);

	}
}

function Partida(){
	this.codigo=codigo;

}