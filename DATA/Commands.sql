-- ================================================
-- SCRIPT BASE DE DATOS: SISTEMA HOTEL + ACTIVIDADES
-- ================================================

-- 1. Crear Base de Datos
CREATE DATABASE IF NOT EXISTS sistema_hotel;
USE sistema_hotel;

-- ================================================
-- 2. Tablas principales
-- ================================================

-- Tabla CEO
CREATE TABLE ceo (
    id_ceo INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);

-- Tabla Usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    documento VARCHAR(50) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telefono VARCHAR(20)
);

-- Tabla Propietario
CREATE TABLE propietario (
    id_propietario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    nit VARCHAR(50) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    telefono VARCHAR(20)
);

-- Tabla Hoteles
CREATE TABLE hotel (
    id_hotel INT AUTO_INCREMENT PRIMARY KEY,
    id_propietario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ciudad VARCHAR(100) NOT NULL,
    promedio_calificacion DECIMAL(3,2) DEFAULT 0,
    img_url VARCHAR(255),
    FOREIGN KEY (id_propietario) REFERENCES propietario(id_propietario) ON DELETE CASCADE
);

-- Tabla Habitaciones
CREATE TABLE habitacion (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    id_hotel INT NOT NULL,
    capacidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    img_url VARCHAR(255),
    numero_habitacion VARCHAR(20) NOT NULL,
    estado ENUM('disponible', 'ocupada') DEFAULT 'disponible',
    FOREIGN KEY (id_hotel) REFERENCES hotel(id_hotel) ON DELETE CASCADE
);

-- Tabla Actividades
CREATE TABLE actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_propietario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion VARCHAR(50),
    img_url VARCHAR(255),
    lugar VARCHAR(100),
    cupos_disponibles INT NOT NULL,
    FOREIGN KEY (id_propietario) REFERENCES propietario(id_propietario) ON DELETE CASCADE
);

-- ================================================
-- 3. Reservas (puede ser de habitacion O actividad)
-- ================================================

CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_habitacion INT NULL,
    id_actividad INT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('pendiente','confirmada','cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion) ON DELETE SET NULL,
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE SET NULL
);

-- ================================================
-- 4. Reseñas (pueden ser de hotel O actividad)
-- ================================================

CREATE TABLE resena (
    id_resena INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_hotel INT NULL,
    id_actividad INT NULL,
    comentario TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_hotel) REFERENCES hotel(id_hotel) ON DELETE SET NULL,
    FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE SET NULL
);

-- ================================================
-- 5. Vista Historial de Reservas
-- ================================================
CREATE VIEW historial_reservas AS
SELECT 
    r.id_reserva,
    u.nombre AS usuario,
    r.fecha_inicio,
    r.fecha_fin,
    r.estado,
    h.nombre AS hotel,
    hab.numero_habitacion,
    a.nombre AS actividad
FROM reserva r
    INNER JOIN usuario u ON r.id_usuario = u.id_usuario
    LEFT JOIN habitacion hab ON r.id_habitacion = hab.id_habitacion
    LEFT JOIN hotel h ON hab.id_hotel = h.id_hotel
    LEFT JOIN actividad a ON r.id_actividad = a.id_actividad;


-- CEO
INSERT INTO ceo (correo, contrasena)
VALUES 
('admin@hotelplus.com', 'admin123');

-- Usuarios
INSERT INTO usuario (nombre, correo, contrasena, documento, fecha_nacimiento, fecha_registro, telefono)
VALUES
('Juan Pérez', 'juanperez@mail.com', '1234', '100200300', '1990-05-15', NOW(), '3001234567'),
('María López', 'marialopez@mail.com', 'abcd', '200300400', '1985-09-22', NOW(), '3019876543'),
('Carlos Gómez', 'carlosgomez@mail.com', 'pass123', '300400500', '1998-11-30', NOW(), '3024567890');

-- Propietarios
INSERT INTO propietario (nombre, correo, contrasena, nit, fecha_nacimiento, fecha_registro, telefono)
VALUES
('Hotelera Andina', 'contacto@andina.com', 'andina123', '900123456', '1975-03-10', NOW(), '3105556677'),
('Tours Medellín', 'info@toursmedellin.com', 'medellin2024', '901234567', '1980-08-05', NOW(), '3112223344');

-- Hoteles
INSERT INTO hotel (id_propietario, nombre, descripcion, ciudad, promedio_calificacion, img_url)
VALUES
(1, 'Hotel Andino', 'Un hotel en el centro de Bogotá', 'Bogotá', 4.5, 'andino.jpg'),
(1, 'Hotel Montaña', 'Hotel campestre en las afueras', 'Medellín', 4.2, 'montana.jpg');

-- Habitaciones
INSERT INTO habitacion (id_hotel, capacidad, precio, img_url, numero_habitacion, estado)
VALUES
(1, 2, 150000, 'habitacion1.jpg', '101', 'disponible'),
(1, 4, 250000, 'habitacion2.jpg', '102', 'ocupada'),
(2, 2, 180000, 'habitacion3.jpg', '201', 'disponible');

-- Actividades
INSERT INTO actividad (id_propietario, nombre, descripcion, precio, duracion, img_url, lugar, cupos_disponibles)
VALUES
(2, 'City Tour Medellín', 'Recorrido por lugares turísticos de Medellín', 120000, '4 horas', 'citytour.jpg', 'Medellín', 20),
(2, 'Guatapé y Piedra del Peñol', 'Excursión a Guatapé con ascenso a la Piedra del Peñol', 200000, '8 horas', 'guatape.jpg', 'Guatapé', 15);

-- Reservas (ejemplo: algunas son hotel, otras actividad)
INSERT INTO reserva (id_usuario, id_habitacion, id_actividad, fecha_inicio, fecha_fin, estado)
VALUES
(1, 1, NULL, '2025-08-25', '2025-08-28', 'confirmada'),  -- Juan reserva habitación
(2, NULL, 1, '2025-09-01', '2025-09-01', 'pendiente'),   -- María reserva tour
(3, 3, NULL, '2025-08-22', '2025-08-23', 'cancelada');   -- Carlos reserva habitación

-- Reseñas
INSERT INTO resena (id_usuario, id_hotel, id_actividad, comentario, calificacion, fecha)
VALUES
(1, 1, NULL, 'Muy buen hotel, excelente servicio.', 5, NOW()),
(2, NULL, 1, 'El tour estuvo genial, buen guía.', 4, NOW()),
(3, 2, NULL, 'El hotel estaba bien, pero un poco costoso.', 3, NOW());

