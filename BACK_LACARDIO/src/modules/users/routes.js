const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

// Rutas CRUD de pacientes
router.get('/', obtenerTodos);
router.get('/:id', obtenerUno);
router.post('/', agregar);
router.delete('/:id', eliminar);

// -----------------------
//   CONTROLADORES
// -----------------------

async function obtenerTodos(req, res, next) {
    try {
        const data = await controlador.todos();
        respuesta.success(req, res, data, 200, 'OK', 'Listado de pacientes');
    } catch (err) {
        next(err);
    }
}

async function obtenerUno(req, res, next) {
    try {
        const data = await controlador.uno(req.params.id);
        respuesta.success(req, res, data, 200, 'OK', 'Paciente encontrado');
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const data = await controlador.agregar(req.body);
        respuesta.success(req, res, data, 200, 'OK', 'Paciente creado correctamente');
    } catch (err) {
        next(err);
    }
}


async function eliminar(req, res, next) {
    try {
        const data = await controlador.eliminar(req.params.id);
        respuesta.success(req, res, data, 200, 'OK', 'Paciente eliminado correctamente');
    } catch (err) {
        next(err);
    }
}

module.exports = router;
