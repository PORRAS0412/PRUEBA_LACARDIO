-- ============================================
-- 1. TABLA PRINCIPAL: PACIENTES
-- ============================================

CREATE TABLE pacientes (
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

-- Índices
CREATE INDEX idx_paciente_documento ON pacientes(numero_documento);

-- ============================================
-- 2. DATOS FINANCIEROS
-- ============================================

CREATE TABLE pacientes_financieros (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    ingresos_mensuales NUMERIC(12,2),
    gastos_mensuales NUMERIC(12,2),
    deudas NUMERIC(12,2),
    capacidad_pago NUMERIC(12,2),   -- (ingresos - gastos - deudas)
    puntaje_riesgo INT,             -- calculado según reglas internas
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_financiero_paciente ON pacientes_financieros(paciente_id);

-- ============================================
-- 3. DATOS COMPLEMENTARIOS
-- ============================================

CREATE TABLE pacientes_complementarios (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    contacto_emergencia VARCHAR(150),
    telefono_emergencia VARCHAR(20),
    alergias TEXT,
    enfermedades TEXT,
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_complementario_paciente ON pacientes_complementarios(paciente_id);
