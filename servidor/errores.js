                if (!err) {
                    database.db("batalla").collection("usuarios", function (err, col) {
                        if (err) {
                            console.log("No se puede obtener los usuarios")
                        }
                        else {
                            console.log("tenemos la colección usuarios");
                            cad.usuarios = col;
                        }        
                    });
                }