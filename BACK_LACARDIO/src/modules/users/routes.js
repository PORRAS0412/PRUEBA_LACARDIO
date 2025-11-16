const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');
const multer = require('multer'); 
const upload = multer();
const xlsx = require('xlsx');
const router = express.Router();

// Rutas CRUD de pacientes
router.get('/', obtenerTodos);
router.get('/:id', obtenerUno);
router.post('/', agregar);
router.delete('/:id', eliminar);
// Nueva ruta para carga XLSX
router.post('/carga-xlsx', upload.single('file'), cargarXLSX);
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

async function cargarXLSX(req, res, next) {
    try {
        if (!req.file) return respuesta.error(req, res, 'Archivo no encontrado', 400);

        const workbook = xlsx.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const resultados = [];

        for (const fila of data) {
            // Mapear los campos del XLSX a la estructura requerida
            const pacienteCompleto = {
                paciente: {
                    id: 0,
                    tipo_documento: fila.tipo_documento,
                    numero_documento: fila.numero_documento,
                    nombres: fila.nombres,
                    apellidos: fila.apellidos,
                    fecha_nacimiento: fila.fecha_nacimiento,
                    sexo: fila.sexo,
                    correo: fila.correo,
                    telefono: fila.telefono,
                    direccion: fila.direccion
                },
                financiero: {
                    ingresos_mensuales: fila.ingresos_mensuales,
                    gastos_mensuales: fila.gastos_mensuales,
                    deudas: fila.deudas,
                    capacidad_pago: fila.capacidad_pago,
                    puntaje_riesgo: fila.puntaje_riesgo
                },
                complementario: {
                    contacto_emergencia: fila.contacto_emergencia,
                    telefono_emergencia: fila.telefono_emergencia,
                    alergias: fila.alergias,
                    enfermedades: fila.enfermedades,
                    observaciones: fila.observaciones
                }
            };

            try {
                const resultado = await controlador.agregar(pacienteCompleto);
                resultados.push({ fila: fila.nombres + ' ' + fila.apellidos, ok: true, paciente_id: resultado.paciente_id });
            } catch (err) {
                resultados.push({ fila: fila.nombres + ' ' + fila.apellidos, ok: false, error: err.message });
            }
        }

        respuesta.success(req, res, resultados, 200, 'OK', 'Carga completada');
    } catch (err) {
        next(err);
    }
}

module.exports = router;
