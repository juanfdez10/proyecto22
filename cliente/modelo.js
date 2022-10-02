
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
    this.crearPartida=function(usr){
     let codigo=Date.now()
     this.partidas[codigo]=new Partida(codigo,usr);
     return codigo;
    }
//para pasarse por parametro un objeto pasamos this
///////
    this.unirseAPartida=function(codigo,usr){
        if(this.partidas[codigo]){
        this.partidas[codigo].agregarJugador(usr);
        }else{
            console.log("la partida no existe");
        }
    }
    this.obtenerPartidas=function(){
        let lista=[];
        for (let key in this.partidas){
            lista.push({"codigo":key,"owner":this.partidas[key].owner});
        }
        return lista;
    }
    this.obtenerPartidasDisponibles=function(){
        //devolver solo las partidas sin completar
        let lista=[];
        for (let key in this.partidas){
            if(this.partidas[key].jugadores.length<2){
                 lista.push({"codigo":key,"owner":this.partidas[key].owner});
                }
        }
        return lista;
    }
}


//  this.agregarPartida=function(nombre){
//      this.partidas.push(new Partida(nombre))
//  }
//  this.eliminarPartida=function(nombre){
//  //TODO
//  }
//}

function Usuario(nick,juego){
    this.nick=nick;
    this.juego=juego;
    this.crearPartida=function(){
        return this.juego.crearPartida(this);

    }
    this.unirseAPartida=function(codigo){
        this.juego.unirseAPartida(codigo,this);
    }

}

function Partida(codigo,usr){
    this.codigo=codigo;
    this.owner=usr;
    this.jugadores=[];//array normal o asociativo ->normal
        //this.maxJugadores=2
    this.fase="Initial";
    this.agregarJugador=function(usr){
     if(this.jugadores.length<2){
     this.jugadores.push(usr);
     }else{
        console.log("la partida esta completa");
     }
    }
 this.agregarJugador(this.owner);
}

