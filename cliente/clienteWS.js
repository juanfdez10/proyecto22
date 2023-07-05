function ClienteWS(){
	this.socket;
//	this.codigo;
	this.conectar=function(){
		this.socket=io();
		this.servidorWS();
	}

	this.crearPartida=function(){
		this.socket.emit("crearPartida",rest.nick);
	}

	this.unirseAPartida=function(codigo){
		this.socket.emit("unirseAPartida",rest.nick,codigo);
	}

	this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick,cws.codigo);
	}

//	this.salir=function(){
//		this.socket.emit("usuarioSale",rest.nick,cws.codigo);
// 	}

	this.colocarBarco=function(nombre,x,y){
		this.socket.emit("colocarBarco",rest.nick,nombre,x,y);
	}
	this.barcosDesplegados=function(){
		this.socket.emit("barcosDesplegados",rest.nick);	
	}
	this.disparar=function(x,y){
		this.socket.emit("disparar",rest.nick,x,y);
	}
	this.servidorWS=function(){
		let cli=this;
		this.socket.on("partidaCreada",function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" crea partida codigo: "+data.codigo)
				iu.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;
			}
			else{
				console.log("No se ha podido crear partida");
				iu.mostrarModal("No se ha podido crear partida");
				iu.mostrarCrearPartida();
				rest.comprobarUsuario();
			}
		});
		this.socket.on("unidoAPartida",function(data){
			if (data.codigo!=-1){
				console.log("Usuario "+rest.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);
				cli.codigo=data.codigo;				
			}
			else{
				console.log("No se ha podido unir a partida");
			}
		});
		this.socket.on("actualizarListaPartidas",function(lista){
			if (!cli.codigo){
				iu.mostrarListaDePartidas(lista);
			}
		});
		//seguir

		this.socket.on("faseDesplegando",function(data){
			tablero.flota=data.flota;
			$('#mEPE').remove();
			tablero.elementosGrid();
			tablero.mostrarFlota();
			iu.mostrarAyuda();
			console.log("Ya puedes desplegar la flota");
		})

		this.socket.on("aJugar",function(res){
			iu.mostrarModal("A jugar ya puede disparar el jugador: " +res);	
		});
		//seguir
		this.socket.on("jugadorAbandona",function(data){
			if (data.codigo != -1) {
                //iu.mostrarHome();
                iu.finPartida();//
                iu.mostrarModal(data.nombreA + " ha abandonado la partida con codigo: " + data.codigoP + "\n" + " Ha ganado " + data.nombreG);
            }
            else {
                iu.mostrarModal(data.nombreA + " ha intentado abandonar la partida pero no ha podido");
            }
		});

		this.socket.on("partidaCancelada", function (res) {
            iu.mostrarModal("Has terminado la partida " + res.codigo + " antes de que empezase")
            //iu.mostrarHome()
            iu.finPartida();
        })
        //seguir
		this.socket.on("barcoColocado",function(res){
			console.log("Barco "+res.barco+" colocado?: "+res.colocado);
			if (res.colocado){
				let barco=tablero.flota[res.barco];
				tablero.terminarDeColocarBarco(barco,res.x,res.y);
				cli.barcosDesplegados();
			}
			else{
				iu.mostrarModal("No se puede colocar ese barco");
			}
		});
		
		this.socket.on("disparo",function(res){
			console.log(res.impacto);
			console.log("Turno: "+res.turno);
			if (res.atacante==rest.nick){
				tablero.updateCell(res.x,res.y,res.impacto,'computer-player');
			}
			else{
				tablero.updateCell(res.x,res.y,res.impacto,'human-player');	
			}
		});
		this.socket.on("faseDesplegando", function (data) {
            tablero.flota = data.flota
            $('#mEPE').remove();
            tablero.elementosGrid()
            tablero.mostrarFlota();
            iu.mostrarAyuda()
        })
		this.socket.on("turno", function () {
            iu.mostrarModal("Respeta el turno rival");
        });
		this.socket.on("finPartida",function(res){
			console.log("Fin de la partida");
			console.log("Ganador: " +res.turno);
			iu.mostrarModal("Fin de la partida. Ganador: " + res.turno + ". Disparos realizados: "+ res.disp);
			iu.finPartida();
			//iu.mostrarModal("Fin de la partida. Ganador: " +res.turno.nick);
		});
	}
}