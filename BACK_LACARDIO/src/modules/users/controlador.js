const db = require('./scripts');
const tabla = 'pacientes';

function todos() {
    return db.todos(tabla);
}

function uno(id) {
    return db.uno(tabla, id);
}

function agregar(body) {
    return db.agregar(tabla, body);
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
