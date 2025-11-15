const config = require('../config');
const { Pool } = require('pg');
require('colors');

const conexionpgnexo = new Pool({
  user: config.postgreslacardio.user,
  host: config.postgreslacardio.host,
  database: config.postgreslacardio.database,
  password: config.postgreslacardio.password,
  port: config.postgreslacardio.port,
});

conexionpgnexo.on('connect', () => {
  console.log(`Conexión a la base de datos PostgreSQL ${config.postgreslacardio.database} establecida correctamente`.green);
});

conexionpgnexo.on('error', (error) => {
  console.error('Error al conectar a la base de datos: NEXO'.red, error.message);
});

module.exports = {
  conexionpgnexo
};
