function ControlWeb(){
	this.comprobarCookie=function(){
		if ($.cookie("nick")){
			rest.nick=$.cookie("nick");	
			rest.comprobarUsuario();		
			
		}
		else{
			this.mostrarAgregarUsuario();
		}
	}
	this.mostrarAgregarUsuario=function(){
	
  	let cadena = '<div id="mAU" >';
	cadena += '<div class="card" style="width:75%;">';
	cadena += '<div class="card-body">';
	cadena += '<h1>GUERRA MARINA</h1>';
	cadena += '<input type="text" class="form-control mb-2 mr-sm-2" id="usr" style="width:100%;" placeholder="Introduce tu nick (max 6 letras)" required>';
	cadena += '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Accede con nick</button>';
	cadena += '<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
	cadena += '</div>';
	//cadena += '<div class="card" style="width: 90%; display: flex; justify-content: center;">';
	cadena += '<img class="img-minimizada" src="cliente/img/armada.webp" alt="imagen barco" style="margin: 0 auto;">';
	//cadena += '</div>';
	cadena += '</div>';
	cadena += '</div>';

		
		//cadena=cadena+'</div>';
		$("#agregarUsuario").append(cadena);     
		
		$("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>6) {
			    e.preventDefault();
			    $('#nota').append('Nick inválido');
			}
			else{
				var nick=$('#usr').val();
				$("#mAU").remove();
				rest.agregarUsuario(nick);
				
			}
		})
	}
	this.mostrarHome=function(){
		$('#mH').remove();
		let cadena="<div class='row' id='mH'>";
		cadena=cadena+'<div class="col">';
		cadena=cadena+"<h2>Bienvenido "+rest.nick+"</h2>";
		cadena=cadena+'<button id="btnSalir" class="btn btn-primary mb-2 mr-sm-2">Salir</button>';
		cadena=cadena+"<div id='codigo'></div>"
		cadena=cadena+"</div></div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerPartidas();
		$("#btnSalir").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$('#gc').remove();
			$('#mAU').remove();
			rest.usuarioSale();
			//cws.salir();
			//iu.salir();
		});
	}
	this.salir=function(nick){
		$("#mCodigoPartida").remove();
		$('#gc').remove();
		cws.codigo=undefined;
		iu.mostrarModal("Hasta la próxima");
		$.removeCookie("nick");
		iu.comprobarCookie();
	}
	this.mostrarCrearPartida=function(){
		$('#mCP').remove();

      let cadena='<div class="card" id="mCP">';
	  	cadena=cadena+'<div class="card-body">'
	    cadena=cadena+'<h4 class="card-title">Crear partida</h4>';
	    cadena=cadena+'<p class="card-text">Crear una nueva partida y espera rival.</p>';   
	    cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear Partida</button>';
	  	cadena=cadena+'</div>';

        $('#crearPartida').append(cadena);
        $("#btnCP").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			cws.crearPartida();
		});
	}
	this.mostrarCodigo=function(codigo){
		let cadena="<div id='mCodigoPartida'><p>Código de la partida: "+codigo+"</p>";
		cadena=cadena+'<button id="btnAP" class="btn btn-primary mb-2 mr-sm-2">Abandonar partida</button>';
		cadena=cadena+"</div>";
		this.mostrarEsperandoRival();
		$('#codigo').append(cadena);
		$('#btnAP').on("click",function(e){
			$('#mEPE').remove();
			$('#mH').remove();
			$('#mAU').remove();
			cws.abandonarPartida();
		});
	}
	this.finPartida=function(){
		$("#mCodigoPartida").remove();
		$('#gc').remove();
		$('#mH').remove();
		$("#mER").remove();
		cws.codigo=undefined;
		tablero=new Tablero(10);
		iu.mostrarHome();
	}
//	this.mostrarListaDePartidas=function(lista){
//		$('#mLP').remove();
//		let cadena="<div id='mLP'>";		
//		cadena=cadena+'<ul class="list-group">';
//		for(i=0;i<lista.length;i++){
//		  cadena = cadena+'<li class="list-group-item">'+lista[i].codigo+' propietario: '+lista[i].owner+'</li>';
//		}
//		cadena=cadena+"</ul>";
//		cadena=cadena+"</div>"
//		$('#listaPartidas').append(cadena);
		
//	}

	this.mostrarListaDePartidas = function (lista) {
		$('#mLP').remove();
		let cadena = '<div id="mLP"><h3>Partidas disponibles</h3>';
		cadena = cadena + '<div class="col" style="margin-top:10px">';
		cadena = cadena + '<ul class="list-group">';
		for (i = 0; i < lista.length; i++) {
			cadena = cadena + "<li class='list-group-item' style='margin-top:10px'><a href='#' value='" + lista[i].codigo +
				"'>Partida creada por <b>" + lista[i].owner + "</b></a></li>";
		}
		cadena = cadena + " </ul>";
		cadena = cadena + " </div></div>";
		$("#listaPartidas").append(cadena);

		$(".list-group a").click(function () {
			codigo = $(this).attr("value");

			if (codigo) {
				$('#mLP').remove();
				$('#mCP').remove();
				cws.unirseAPartida(codigo);
			}
		});
	}
//	this.quitarER=function(){
//		$("#mER").remove();
//	}
	this.mostrarEsperandoRival=function(){
	  $('#mEPE').remove();
		var cadena = '<div class="mt-5"id="mEPE"><h3>Esperando Rival...</h3>';
		cadena = cadena + '<img src="cliente/img/waiting.jpg">';
		cadena = cadena + '</div>';
		$('#agregarUsuario').append(cadena);
	  }
	this.mostrarModal = function (msg) {
		$('#mM').remove();
		let cadena = "<p class='text-dark' id='mM'>" + msg + "</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
}