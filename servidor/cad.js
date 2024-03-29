let mongo = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
function Cad() {

    this.logs;
    this.usuarios;

    // logs
    this.insertarLog = function (log, callback) {
        insertar(this.logs, log, callback);
    }

    this.obtenerLogs = function (callback) {
        obtenerTodos(this.logs, callback);
    }

    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    function obtenerTodos(coleccion, callback) {
        coleccion.find().toArray(function (error, col) {
            callback(col);
        });
    };

       this.obtenerUsuarios=function(callback){
        obtenerTodos(this.usuarios,callback);
    }

    this.obtenerOCrearUsuario=function(criterio,callback){
        obtenerOCrear(this.usuarios,criterio,callback)
    }


    //USUARIOS

    this.obtenerUsuarios = function (callback) {
        obtenerTodos(this.logs, callback);
    }

    this.conectar = function () {
        let cad = this;
        mongo.connect('mongodb+srv://batalla:<password>@cluster0.cmqcemc.mongodb.net/?retryWrites=true&w=majority',
            { useUnifiedTopology: true }, function (err, database) {
                if (!err) {
                    database.db("batalla").collection("logs", function (err, col) {
                        if (err) {
                            console.log("No se puede obtener la coleccion")
                        }
                        else {
                            console.log("tenemos la colección logs");
                            cad.logs = col;
                        }
                    });
                }        

            })
    }
}
module.exports.Cad = Cad