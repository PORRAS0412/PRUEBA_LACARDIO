const db = require('./scripts');
const tabla = 'pacientes';
const xlsx = require('xlsx');

function todos() {
    return db.todos(tabla);
}

function uno(id) {
    return db.uno(id);
}

function agregar(body) {
    return db.agregarPacienteCompleto(body);
}

function eliminar(id) {
    return db.eliminar(tabla, id);
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar
};
