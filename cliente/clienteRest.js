function ClienteRest(){
	this.nick;	
	this.agregarUsuario=function(nick){
		let cli=this;
		$.getJSON("/agregarUsuario/"+nick,function(data){
			//Despues de que se ejecute el servidor
			console.log(data);
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" registrado")
				cli.nick=data.nick;
				$.cookie("nick",data.nick);
				cws.conectar();
				iu.mostrarHome()
			}
			else{
				console.log("No se ha podido registrar el usuario")
				iu.mostrarModal("El nick ya está en uso");
				iu.mostrarAgregarUsuario();
			}
		});
	}
	this.comprobarUsuario=function(){
		let cli=this;
		$.getJSON("/comprobarUsuario/"+this.nick,function(data){
			
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" activo");
				cws.conectar();
				iu.mostrarHome();
			}
			else{
				console.log("El usuario no está activo")
				iu.mostrarAgregarUsuario();
			}
		});
	}

	this.obtenerPartidas=function(){
		let cli=this;
		$.getJSON("/obtenerPartidas",function(lista){
			console.log(lista);
			iu.mostrarListaDePartidas(lista);
		});
	}
//	this.obtenerListaPartidasDisponibles=function(){
//		$.getJSON("/obtenerPartidasDisponibles",function(lista){
//			console.log(lista);
//			iu.mostrarListaDePartidasDisponibles(lista);
//		});
//	}

	this.usuarioSale=function(){
		let nick=this.nick;
		$.getJSON("/salir/"+nick,function(){
			$.removeCookie("nick");
			$('#mEPE').remove();
			iu.comprobarCookie();
		})
	}
}