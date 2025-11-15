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

-- ============================================
-- 4. LIBROS SUBIDOS AL SISTEMA
-- ============================================

CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    autor VARCHAR(255),
    ano_publicacion INT,
    archivo_url TEXT NOT NULL, -- ruta del archivo subido
    fecha_subida TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. REPORTES DEL SISTEMA
-- ============================================

CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    tipo_reporte VARCHAR(50) NOT NULL,   -- Excel, gráfico, pdf, etc.
    descripcion TEXT,
    archivo_url TEXT,                    -- enlace al archivo generado
    fecha_generado TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. HISTORIAL DE ARCHIVOS CARGADOS (.xlsx)
-- ============================================

CREATE TABLE cargas_excel (
    id SERIAL PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    estado VARCHAR(30) CHECK (estado IN ('Procesando', 'Completado', 'Error')),
    fecha_carga TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. DETALLE DE LA CARGA MASIVA
-- ============================================

CREATE TABLE cargas_excel_detalle (
    id SERIAL PRIMARY KEY,
    carga_id INT NOT NULL REFERENCES cargas_excel(id) ON DELETE CASCADE,
    numero_fila INT NOT NULL,
    paciente_documento VARCHAR(20),
    nombre VARCHAR(150),
    apellido VARCHAR(150),
    ingreso NUMERIC(12,2),
    gasto NUMERIC(12,2),
    deuda NUMERIC(12,2),
    estado VARCHAR(20) CHECK (estado IN ('OK', 'Error')),
    mensaje TEXT
);
