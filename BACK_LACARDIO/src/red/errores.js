const respuesta = require('./respuestas');


function error(err,req,res,nex){
    console.log('error' + err);
    const mensaje = err.mensaje || 'Error interno'
    const status = err.status || 500

    respuesta.error(req,res,mensaje,status);
}

module.exports = error;