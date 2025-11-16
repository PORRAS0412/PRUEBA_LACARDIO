-- ============================================
-- CREAR TABLAS SOLO SI NO EXISTEN
-- ============================================

CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(10) NOT NULL,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) CHECK (sexo IN ('M', 'F', 'Otro')),
    correo VARCHAR(150),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paciente_documento
    ON pacientes(numero_documento);

CREATE TABLE IF NOT EXISTS pacientes_financieros (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    ingresos_mensuales NUMERIC(12,2),
    gastos_mensuales NUMERIC(12,2),
    deudas NUMERIC(12,2),
    capacidad_pago NUMERIC(12,2),
    puntaje_riesgo INT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_financiero_paciente
    ON pacientes_financieros(paciente_id);

CREATE TABLE IF NOT EXISTS pacientes_complementarios (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    contacto_emergencia VARCHAR(150),
    telefono_emergencia VARCHAR(20),
    alergias TEXT,
    enfermedades TEXT,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complementario_paciente
    ON pacientes_complementarios(paciente_id);
