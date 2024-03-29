function ServidorWS() {
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }

    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos)
    }

    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }

    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io, codigoStr, "partidaCreada", res)
                let lista = juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida", function (nick, codigo) {
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                let partida = juego.obtenerPartida(codigo);
                if (partida.esDesplegando()) {
                    let us = juego.obtenerUsuario(nick)
                    let flota = us.obtenerFlota()
                    res = {}
                    res.flota = flota
                    cli.enviarATodosEnPartida(io, codigoStr, "faseDesplegando", res);
                }
            });

            socket.on("abandonarPartida", function (nick, codigo) {
                let jugador = juego.obtenerUsuario(nick);
                let partida = juego.obtenerPartida(codigo)

                let codigoStr = codigo.toString();
                if (jugador && partida) {
                    let rival = partida.obtenerRival(nick);
                    if (rival == undefined){
                        cli.enviarAlRemitente(socket, "partidaCancelada", {codigo: codigo})
                        partida.abandonarPartida(jugador)
                    } else {
                        let res = { codigoP: codigo, nombreA: jugador.nick, nombreG: rival.nick }                    
                        partida.abandonarPartida(jugador)
                        cli.enviarATodosEnPartida(io, codigoStr, "jugadorAbandona", res);
                        socket.leave(codigoStr)
                    }
                }
            });

            socket.on("colocarBarco", function (nick, nombre, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let barco = jugador.colocarBarco(nombre, x, y)
                    let res = { barco: barco.nombre, x: x, y: y, colocado: barco.desplegado }
                    cli.enviarAlRemitente(socket, "barcoColocado", res);
                }
            });

            socket.on("barcosDesplegados", function (nick) {
                let jugador = juego.obtenerUsuario(nick);
                if (jugador) {
                    let partida = jugador.partida;
                    let res = jugador.barcosDesplegados();
                    let codigoStr = partida.codigo.toString();
                    if (partida.esJugando()) {
                        let turno = partida.obtenerTurno();
                        //cli.enviarATodosEnPartida(io, codigoStr, "aJugar", {});
                        cli.enviarATodosEnPartida(io, codigoStr, "aJugar", turno.nick);
                    }
                }
            });

            socket.on("disparar", function (nick, x, y) {
                let jugador = juego.obtenerUsuario(nick);
                let res = { nick: nick, x: x, y: y }
                if (jugador) {
                    let partida = jugador.partida;
                    let turno = partida.obtenerTurno();
                    if (jugador == turno) {
                        let impacto = jugador.disparar(x, y)
                        let res2 = { atacante: jugador.nick, impacto: impacto, x: x, y: y, turno: turno.nick, disp: jugador.disparosrealizados }
                        if (partida.esFinal()) {
                            //let res3 = { ganador: jugador.nick, partidaganada: jugador.partida, turno: jugador.nick.turno }//
                            cli.enviarATodosEnPartida(io, partida.codigo.toString(), "finPartida", res2);
                        }
                        cli.enviarATodosEnPartida(io, partida.codigo.toString(), "disparo", res2);
                    }
                    else {
                        cli.enviarAlRemitente(socket, "turno", res);
                    }
                }
            });

        });
    }
}

module.exports.ServidorWS = ServidorWS;