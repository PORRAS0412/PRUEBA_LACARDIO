# README -- Sistema de Registro de Pacientes LACARDIO

## 📌 Descripción General

El sistema LACARDIO es una aplicación web completa desarrollada con un
**frontend en Angular**, un **backend en Node.js / Express**, y una base
de datos **PostgreSQL**.\
Permite registrar pacientes mediante un formulario web con reglas de
negocio, visualizar reportes, manejar carga de archivos y consultar
información vía microservicios.

El proyecto está completamente **dockerizado** para facilitar su
despliegue en cualquier entorno.

------------------------------------------------------------------------

## 🧩 Arquitectura del Proyecto

    /FRONT_LACARDIO     → Aplicación Angular (Frontend)
    /BACK_LACARDIO      → API Node.js/Express (Backend)
    /POSTMAN_DOC        → Colección y variables de entorno para pruebas de API
    docker-compose.yml  → Orquestación Docker

------------------------------------------------------------------------

## 🛠 Tecnologías

### **Frontend**

-   Angular
-   HTML / CSS / Bootstrap / Material
-   Formulario reactivo y diseño responsivo

### **Backend**

-   Node.js
-   Express
-   PostgreSQL con pg

### **Base de Datos**

-   PostgreSQL 16

### **Contenedores**

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## 🚀 Funcionalidades del Sistema

### ✔ 1. Registro de Pacientes (Formulario Web)

-   Captura de datos personales
-   Validaciones y reglas de negocio
-   Cálculos financieros
-   Envío al backend para almacenamiento

### ✔ 2. Microservicio WS

-   Retorna datos principales de un paciente registrado

### ✔ 3. Formulario Responsivo

Funciona en: - PC - Tablet - Celular

### ✔ 4. Visor de Libros

Listado simple de libros cargados al sistema.

### ✔ 5. Reportes

-   Exportación a Excel
-   Gráficos estadísticos

### ✔ 6. Carga masiva (.xlsx)

-   Inserta datos básicos y financieros del paciente

### ✔ 7. Documentación POSTMAN

La carpeta **POSTMAN_DOC** contiene: - Colección - Variables de
entorno - Ejemplos de peticiones

------------------------------------------------------------------------

## 🗄 Modelo de Base de Datos (SQL)

``` sql
-- TABLA PRINCIPAL: PACIENTES
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

CREATE INDEX idx_paciente_documento ON pacientes(numero_documento);

-- DATOS FINANCIEROS
CREATE TABLE pacientes_financieros (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    ingresos_mensuales NUMERIC(12,2),
    gastos_mensuales NUMERIC(12,2),
    deudas NUMERIC(12,2),
    capacidad_pago NUMERIC(12,2),
    puntaje_riesgo INT,
    fecha_registro TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_financiero_paciente ON pacientes_financieros(paciente_id);

-- DATOS COMPLEMENTARIOS
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
```

------------------------------------------------------------------------

## 📦 Despliegue con Docker

------------------------------------------------------------------------

## ▶️ Cómo desplegar

### 1. Clonar

    git clone https://github.com/PORRAS0412/PRUEBA_LACARDIO.git
    cd LACARDIO

### 2. Construir y levantar

    docker-compose up -d --build

### 3. Acceso

  Servicio     URL
  ------------ -----------------------
  Frontend     http://localhost
  Backend      http://localhost:3000
  PostgreSQL   localhost:5432

------------------------------------------------------------------------

## 📄 Licencia

Proyecto académico / empresarial.
