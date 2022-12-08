let modelo = require("./modelo.js");

const SIZE = 10

describe("El juego...", function () {
  let miJuego;
  let us1, us2, partida;

  beforeEach(function () {
    miJuego = new modelo.Juego(true);
    miJuego.agregarUsuario("pepe");
    miJuego.agregarUsuario("luis");
    let res = miJuego.jugadorCreaPartida("pepe");
    miJuego.jugadorSeUneAPartida("luis", res.codigo);
    us1 = miJuego.obtenerUsuario("pepe");
    us2 = miJuego.obtenerUsuario("luis");
    partida = miJuego.obtenerPartida(res.codigo);
  });

  it("Comprobar nicks de los usuarios", function () {
    expect(us1.nick).toEqual("pepe");
    expect(us2.nick).toEqual("luis");
  });

  it("Comprobar que estan en la partida", function () {
    expect(partida.estoy("pepe")).toEqual(true);
    expect(partida.estoy("luis")).toEqual(true);
  });

  it("Comprobar que tienen tablero propio y rival", function () {
    expect(us1.tableroPropio).toBeDefined();
    expect(us2.tableroPropio).toBeDefined();
    expect(us1.tableroRival).toBeDefined();
    expect(us2.tableroRival).toBeDefined();

    expect(us1.tableroPropio.casillas.length).toEqual(SIZE);
    expect(us2.tableroPropio.casillas.length).toEqual(SIZE);

    //habría que recorrer las SIZE columnas
    for (x = 0; x < SIZE; x++) {
      expect(us1.tableroPropio.casillas[x].length).toEqual(SIZE);
    }
    //  expect(us2.tableroPropio.casillas[0].length).toEqual(SIZE);

    //habría que recorrer todo el tablero
    expect(us1.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(true);
  });

  it("Comprobar que tienen flota (4 barcos, tam 1,2,3,4)", function () {
    expect(us1.flota).toBeDefined();
    expect(us2.flota).toBeDefined();

    expect(Object.keys(us1.flota).length).toEqual(4);
    expect(Object.keys(us2.flota).length).toEqual(4);

    expect(us1.flota["p1"].tam).toEqual(1);
    expect(us1.flota["p2"].tam).toEqual(2);
    expect(us1.flota["p3"].tam).toEqual(3);
    expect(us1.flota["p4"].tam).toEqual(4);
  });

  it("Comprobar que la partida está en fase desplegando", function () {
    expect(partida.esJugando()).toEqual(false);
    expect(partida.esDesplegando()).toEqual(true);
  });

  describe("A jugar Caso 1!", function () {
    beforeEach(function () {
      us1.colocarBarco("p1", 0, 0);
      us1.colocarBarco("p2", 0, 1);
      us1.colocarBarco("p3", 0, 2);
      us1.colocarBarco("p4", 0, 3);
      us1.barcosDesplegados();
      us2.colocarBarco("p1", 0, 0);
      us2.colocarBarco("p2", 0, 1);
      us2.colocarBarco("p3", 0, 2);
      us2.colocarBarco("p4", 0, 3);
      us2.barcosDesplegados();
    });

    it("Comprobar que las flotas están desplegadas", function () {
      expect(us1.todosDesplegados()).toEqual(true);
      expect(us2.todosDesplegados()).toEqual(true);
      expect(partida.flotasDesplegadas()).toEqual(true);
      expect(partida.esJugando()).toEqual(true);

      // p1
      expect(us2.tableroPropio.casillas[0][0].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][0].contiene.esAgua()).toEqual(true);

      // p2
      expect(us2.tableroPropio.casillas[0][1].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][1].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[2][1].contiene.esAgua()).toEqual(true);

      //p3
      expect(us2.tableroPropio.casillas[0][2].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][2].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[2][2].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][2].contiene.esAgua()).toEqual(true);

      // p4
      expect(us2.tableroPropio.casillas[0][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[1][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[2][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[3][3].contiene.esAgua()).toEqual(false);
      expect(us2.tableroPropio.casillas[4][3].contiene.esAgua()).toEqual(true);
    });

    it("Comprobar jugada que Pepe gana", function () {
      expect(partida.turno.nick).toEqual("pepe");

      //Hundir p1
      expect(us2.flota["p1"].estado).toEqual("intacto");
      us1.disparar(0, 0);
      expect(us2.flota["p1"].estado).toEqual("hundido");

      // hundir p2
      expect(us2.flota["p2"].estado).toEqual("intacto");
      us1.disparar(0, 1)
      expect(us2.flota["p2"].estado).toEqual("tocado");
      us1.disparar(1, 1)
      expect(us2.flota["p2"].estado).toEqual("hundido");

      // hundir p3
      expect(us2.flota["p3"].estado).toEqual("intacto");
      us1.disparar(0, 2)
      expect(us2.flota["p3"].estado).toEqual("tocado");
      us1.disparar(1, 2)
      expect(us2.flota["p3"].estado).toEqual("tocado");
      us1.disparar(2, 2)
      expect(us2.flota["p3"].estado).toEqual("hundido");

      // hundir p4
      expect(us2.flota["p4"].estado).toEqual("intacto");
      us1.disparar(0, 3)
      expect(us2.flota["p4"].estado).toEqual("tocado");
      us1.disparar(1, 3)
      expect(us2.flota["p4"].estado).toEqual("tocado");
      us1.disparar(2, 3)
      expect(us2.flota["p4"].estado).toEqual("tocado");
      us1.disparar(3, 3)
      expect(us2.flota["p4"].estado).toEqual("hundido");

      expect(partida.esFinal()).toEqual(true);
      expect(us2.flotaHundida()).toEqual(true);
      expect(us1.flotaHundida()).toEqual(false);
    });

    it("Comprobar el cambio de turno", function () {
      us1.disparar(3, 0);
      expect(partida.turno.nick).toEqual("luis");
    });

    it("Comprobar que no deja disparar sin turno", function () {
      us2.disparar(0, 0);
      expect(us1.flota["p1"].estado).toEqual("intacto");
    });
  });

  describe("Comprobar colocaciones invalidas", function () {
    beforeEach(function () {
      us1.colocarBarco("p1", 0, 0);
      us1.colocarBarco("p2", 0, 0);
      us1.colocarBarco("p3", 0, 2);
      us1.colocarBarco("p4", 6, 0);
      us1.barcosDesplegados();
      us2.colocarBarco("p1", 3, 0);
      us2.colocarBarco("p2", 2, 0);
      us2.colocarBarco("p3", 1, 0);
      us2.colocarBarco("p4", 7, 0);
      us2.barcosDesplegados();
    });

    it("Comprobar limites del tablero", function (){
      expect(us1.flota["p4"].desplegado).toEqual(true);
      expect(us2.flota["p4"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco que colisione con otro", function (){
      expect(us2.flota["p1"].desplegado).toEqual(true);
      expect(us2.flota["p2"].desplegado).toEqual(false);
      expect(us2.flota["p3"].desplegado).toEqual(false);
    })

    it("Comprobar que no se puede colocar un barco encima de otro", function (){
      expect(us1.flota["p1"].desplegado).toEqual(true);
      expect(us1.flota["p2"].desplegado).toEqual(false);
    })
    
  });

});