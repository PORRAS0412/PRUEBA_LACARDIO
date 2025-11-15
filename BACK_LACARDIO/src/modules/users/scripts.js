const db = require('../../db/postgres');

function todos(tabla) {
   return new Promise((res, rej) => {
      db.conexionpgnexo.query(`SELECT * FROM ${tabla} order by 1 desc`, (error, resultado) => {
         if (error) {
            console.error('Error al ejecutar la consulta:', error);
            rej(error);
         } else {
            console.log('Resultados de la consulta:', resultado.rows);
            res(resultado.rows);
         }
      });
   });
}

function uno(tabla, id) {
   return new Promise((res, rej) => {
      db.conexionpgnexo.query(`SELECT * FROM ${tabla} where id = ${id}`, (error, resultado) => {
         if (error) {
            console.error('Error al ejecutar la consulta:', error);
            rej(error);
         } else {
            console.log('Resultados de la consulta:', resultado.rows);
            res(resultado.rows);
         }
      });
   });
}

function eliminar(tabla, id) {
   return new Promise((res, rej) => {
      db.conexionpgnexo.query(
         `DELETE FROM ${tabla} WHERE id = $1`,
         [id], // ✔️ El id llega directamente
         (error, resultado) => {
            if (error) {
               console.error('Error al ejecutar la consulta:', error);
               rej(error);
            } else {
               console.log("Filas eliminadas:", resultado.rowCount);
               res({
                  deleted: resultado.rowCount
               });
            }
         }
      );
   });
}


function agregar(tabla, data) {
   if (data && data.id == 0) {
      return insertarUsuario(tabla, data);
   } else {
      return actualizarUsuario(tabla, data);
   }
}


function insertarUsuario(tabla, data) {
   // Obtenemos los campos y valores del objeto data
   const campos = Object.keys(data);
   const valores = Object.values(data);

   // Quitamos el primer campo (suponiendo que es el id) de los arrays campos y valores
   campos.shift();
   valores.shift();

   // Creamos las cadenas de campos y valores para la consulta INSERT
   const camposInsert = campos.join(', ');
   const valoresInsert = valores.map((valor, index) => `$${index + 1}`).join(', ');

   return new Promise((resolve, reject) => {
      db.conexionpgnexo.query(`INSERT INTO ${tabla} (${camposInsert}) VALUES (${valoresInsert}) RETURNING *`, valores, (error, resultado) => {
         if (error) {
            console.error('Error al ejecutar la consulta:', error);
            reject(error);
         } else {
            console.log('Resultados de la consulta:', resultado.rows);
            resolve(resultado.rows);
         }
      });
   });
}


async function actualizarUsuario(tabla, data) {
   const campos = Object.keys(data);
   const valores = Object.values(data);
   const camposActualizacion = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');


   return new Promise((res, rej) => {
      db.conexionpgnexo.query(`UPDATE ${tabla} SET ${camposActualizacion} WHERE id = $${valores.length + 1}`, [...valores, data.id], (error, resultado) => {
         if (error) {
            console.error('Error al ejecutar la consulta:', error);
            rej(error);
         } else {
            console.log('Resultados de la consulta:', resultado.rows);
            res(resultado.rows);
         }
      });
   });
}


module.exports = {
   todos,
   uno,
   eliminar,
   agregar
};