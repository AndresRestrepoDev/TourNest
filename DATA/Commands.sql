CREATE DATABASE IF NOT EXISTS TourNest;
USE TourNest;

CREATE TABLE ceo (
    id_ceo INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    document VARCHAR(100) UNIQUE NOT NULL,
    date_birth DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20)
);

CREATE TABLE owners (
    id_owner INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    nit VARCHAR(100) UNIQUE NOT NULL,
    date_birth DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20)
);

CREATE TABLE hotels (
    id_hotel INT AUTO_INCREMENT PRIMARY KEY,
    id_owner INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    rating_average DECIMAL(3,2) DEFAULT 0,
    img_url VARCHAR(300),
    FOREIGN KEY (id_owner) REFERENCES owners(id_owner) ON DELETE CASCADE
);

CREATE TABLE rooms (
    id_room INT AUTO_INCREMENT PRIMARY KEY,
    id_hotel INT NOT NULL,
    capacity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    img_url VARCHAR(300),
    number_room VARCHAR(20) NOT NULL,
    state ENUM('available', 'occupied') DEFAULT 'available',
    FOREIGN KEY (id_hotel) REFERENCES hotels(id_hotel) ON DELETE CASCADE
);

CREATE TABLE activitys (
    id_activity INT AUTO_INCREMENT PRIMARY KEY,
    id_owner INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    img_url VARCHAR(300),
    place VARCHAR(200),
    quota_available INT NOT NULL,
    FOREIGN KEY (id_owner) REFERENCES owners(id_owner) ON DELETE CASCADE
);

CREATE TABLE reserves (
    id_reserve INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_room INT NULL,
    id_activity INT NULL,
    date_init DATE NOT NULL,
    date_end DATE NOT NULL,
    state ENUM('pending','confirmed','canceled') DEFAULT 'pending',
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_room) REFERENCES rooms(id_room) ON DELETE SET NULL,
    FOREIGN KEY (id_activity) REFERENCES activitys(id_activity) ON DELETE SET NULL
);

CREATE TABLE reviews (
    id_reviews INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_hotel INT NULL,
    id_activity INT NULL,
    comment TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_hotel) REFERENCES hotels(id_hotel) ON DELETE SET NULL,
    FOREIGN KEY (id_activity) REFERENCES activitys(id_activity) ON DELETE SET NULL
);

SELECT * FROM history_reviews;

CREATE VIEW history_reviews AS
SELECT 
    r.id_reserve,
    u.name AS users,
    r.date_init,
    r.date_end,
    r.state,
    h.name AS hotels,
    hab.number_room,
    a.name AS activitys
FROM reserves r
    INNER JOIN users u ON r.id_user = u.id_user
    LEFT JOIN rooms hab ON r.id_room = hab.id_room
    LEFT JOIN hotels h ON hab.id_hotel = h.id_hotel
    LEFT JOIN activitys a ON r.id_activity = a.id_activity;

INSERT INTO ceo (email, password) VALUES
('admin@tournest.com', 'admin123');

INSERT INTO users (name, email, password, document, date_birth, phone) VALUES
('Carlos Gómez', 'carlosg@example.com', 'pass123', 'CC1001', '1990-05-12', '3001234567'),
('María López', 'marial@example.com', 'pass123', 'CC1002', '1988-08-22', '3019876543'),
('Andrés Restrepo', 'andresr@example.com', 'pass123', 'CC1003', '1995-11-03', '3024567890'),
('Laura Torres', 'laurat@example.com', 'pass123', 'CC1004', '1992-07-19', '3106547891');

INSERT INTO owners (name, email, password, nit, date_birth, phone) VALUES
('Hotel Manager SAS', 'hotelmanager@example.com', 'pass123', 'NIT900111', '1980-01-15', '3157896541'),
('Adventure Tours LTDA', 'adventure@example.com', 'pass123', 'NIT900222', '1982-09-09', '3169873210');

INSERT INTO hotels (id_owner, name, description, city, rating_average, img_url) VALUES
(1, 'Hotel El Dorado', 'Un hotel de lujo en el centro de Medellín.', 'Medellín', 4.5, 'https://example.com/hotel1.jpg'),
(1, 'Hotel Playa Bonita', 'Hotel frente al mar Caribe.', 'Cartagena', 4.8, 'https://example.com/hotel2.jpg');

INSERT INTO rooms (id_hotel, capacity, price, img_url, number_room, state) VALUES
(1, 2, 150000, 'https://example.com/room101.jpg', '101', 'available'),
(1, 4, 250000, 'https://example.com/room102.jpg', '102', 'occupied'),
(2, 2, 200000, 'https://example.com/room201.jpg', '201', 'available'),
(2, 3, 280000, 'https://example.com/room202.jpg', '202', 'available');

INSERT INTO activitys (id_owner, name, description, price, duration, img_url, place, quota_available) VALUES
(2, 'Tour en Guatapé', 'Visita a la piedra del Peñol y el pueblo de Guatapé.', 120000, '8 horas', 'https://example.com/tour1.jpg', 'Guatapé, Antioquia', 20),
(2, 'Buceo en Islas del Rosario', 'Experiencia de buceo en aguas cristalinas.', 250000, '5 horas', 'https://example.com/tour2.jpg', 'Islas del Rosario, Cartagena', 15);

INSERT INTO reserves (id_user, id_room, id_activity, date_init, date_end, state) VALUES
(1, 1, NULL, '2025-09-01', '2025-09-05', 'confirmed'),
(2, 2, NULL, '2025-09-10', '2025-09-15', 'pending'),
(3, NULL, 1, '2025-09-20', '2025-09-20', 'confirmed'),
(4, NULL, 2, '2025-09-25', '2025-09-25', 'canceled');

INSERT INTO reviews (id_user, id_hotel, id_activity, comment, rating) VALUES
(1, 1, NULL, 'Excelente servicio y muy buena ubicación.', 5),
(2, 1, NULL, 'El hotel estaba limpio pero un poco ruidoso.', 3),
(3, NULL, 1, 'El tour fue increíble, super recomendado.', 5),
(4, NULL, 2, 'La experiencia de buceo fue espectacular.', 4);






