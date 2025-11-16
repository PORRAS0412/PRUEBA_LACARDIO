const db = require('../../db/postgres');

// ============================================================================
//  SELECT TODOS
// ============================================================================
function todos(tabla) {
  return new Promise((res, rej) => {
    db.conexionpgnexo.query(
      `SELECT p.*, pf.*, pc.* FROM pacientes p LEFT JOIN pacientes_financieros pf ON pf.paciente_id = p.id LEFT JOIN pacientes_complementarios pc ON pc.paciente_id = p.id`,
      (error, resultado) => {
        if (error) return rej(error);
        res(resultado.rows);
      }
    );
  });
}

// ============================================================================
//  SELECT UNO
// ============================================================================
function uno(id) {
  return new Promise((res, rej) => {
    const query = `
      SELECT p.*, pf.*, pc.* FROM pacientes p LEFT JOIN pacientes_financieros pf ON pf.paciente_id = p.id LEFT JOIN pacientes_complementarios pc ON pc.paciente_id = p.id WHERE p.id = $1
    `;

    db.conexionpgnexo.query(query, [id], (error, resultado) => {
      if (error) return rej(error);
      res(resultado.rows[0]);
    });
  });
}

// ============================================================================
//  ELIMINAR REGISTRO
// ============================================================================
function eliminar(tabla, id) {
  return new Promise((res, rej) => {
    db.conexionpgnexo.query(
      `DELETE FROM ${tabla} WHERE id = $1`,
      [id],
      (error, resultado) => {
        if (error) return rej(error);
        res({ deleted: resultado.rowCount });
      }
    );
  });
}

// ============================================================================
//  FUNCIONES GENÉRICAS INSERT / UPDATE
// ============================================================================
function agregar(tabla, data) {
  return data.id == 0
    ? insertarUsuario(tabla, data)
    : actualizarUsuario(tabla, data);
}

function insertarUsuario(tabla, data) {
  const campos = Object.keys(data).filter((c) => c !== "id");
  const valores = Object.values(data).slice(1);

  const placeholders = campos.map((_, i) => `$${i + 1}`).join(", ");

  return new Promise((resolve, reject) => {
    db.conexionpgnexo.query(
      `INSERT INTO ${tabla} (${campos.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      valores,
      (error, resultado) => {
        if (error) return reject(error);
        resolve(resultado.rows[0]);
      }
    );
  });
}

function actualizarUsuario(tabla, data) {
  const campos = Object.keys(data).filter((c) => c !== "id");
  const valores = campos.map((c) => data[c]);
  const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");

  return new Promise((resolve, reject) => {
    db.conexionpgnexo.query(
      `UPDATE ${tabla} SET ${sets} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, data.id],
      (error, resultado) => {
        if (error) return reject(error);
        resolve(resultado.rows[0]);
      }
    );
  });
}

// ============================================================================
//  INSERTAR / ACTUALIZAR PACIENTE COMPLETO (3 TABLAS EN TRANSACCIÓN)
// ============================================================================
async function agregarPacienteCompleto(data) {
  const { paciente, financiero, complementario } = data;

  const client = await db.conexionpgnexo.connect();

  try {
    await client.query('BEGIN');

    let pacienteId = paciente.id;

    // ========== PACIENTE ==========
    if (pacienteId === 0) {
      const campos = Object.keys(paciente).filter((c) => c !== "id");
      const valores = Object.values(paciente).slice(1);
      const placeholders = campos.map((_, i) => `$${i + 1}`).join(", ");

      const insert = await client.query(
        `INSERT INTO pacientes (${campos.join(", ")})
         VALUES (${placeholders})
         RETURNING id`,
        valores
      );

      pacienteId = insert.rows[0].id;
    } else {
      const campos = Object.keys(paciente).filter((c) => c !== "id");
      const valores = campos.map((c) => paciente[c]);
      const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(", ");

      await client.query(
        `UPDATE pacientes
         SET ${sets}
         WHERE id = $${campos.length + 1}`,
        [...valores, pacienteId]
      );
    }

    // ========== FINANCIERO ==========
    if (financiero) {
      const result = await client.query(
        `SELECT id FROM pacientes_financieros WHERE paciente_id = $1`,
        [pacienteId]
      );

      const datosFinanc = [
        financiero.ingresos_mensuales,
        financiero.gastos_mensuales,
        financiero.deudas,
        financiero.capacidad_pago,
        financiero.puntaje_riesgo
      ];

      if (result.rowCount === 0) {
        await client.query(
          `INSERT INTO pacientes_financieros
            (paciente_id, ingresos_mensuales, gastos_mensuales, deudas, capacidad_pago, puntaje_riesgo)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [pacienteId, ...datosFinanc]
        );
      } else {
        await client.query(
          `UPDATE pacientes_financieros
           SET ingresos_mensuales=$2, gastos_mensuales=$3, deudas=$4,
               capacidad_pago=$5, puntaje_riesgo=$6
           WHERE paciente_id=$1`,
          [pacienteId, ...datosFinanc]
        );
      }
    }

    // ========== COMPLEMENTARIO ==========
    if (complementario) {
      const result = await client.query(
        `SELECT id FROM pacientes_complementarios WHERE paciente_id = $1`,
        [pacienteId]
      );

      const datosComp = [
        complementario.contacto_emergencia,
        complementario.telefono_emergencia,
        complementario.alergias,
        complementario.enfermedades,
        complementario.observaciones
      ];

      if (result.rowCount === 0) {
        await client.query(
          `INSERT INTO pacientes_complementarios
            (paciente_id, contacto_emergencia, telefono_emergencia, alergias, enfermedades, observaciones)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [pacienteId, ...datosComp]
        );
      } else {
        await client.query(
          `UPDATE pacientes_complementarios
           SET contacto_emergencia=$2, telefono_emergencia=$3, alergias=$4,
               enfermedades=$5, observaciones=$6
           WHERE paciente_id=$1`,
          [pacienteId, ...datosComp]
        );
      }
    }

    await client.query('COMMIT');

    return { ok: true, paciente_id: pacienteId };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error transacción:", err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  todos,
  uno,
  eliminar,
  agregar,
  agregarPacienteCompleto
};
