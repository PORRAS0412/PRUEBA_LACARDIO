const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const cors = require('cors');
const error = require('./red/errores');
const users = require('./modules/users/routes');

// Configuración
const app = express();
app.set('port', config.app.port);

// Middlewares
app.use(morgan('dev'));
app.use(cors(config.app.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/lacardio/users', users);


app.use(error);


module.exports = app;