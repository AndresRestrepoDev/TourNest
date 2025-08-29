CREATE DATABASE IF NOT EXISTS TourNest;
USE TourNest;

DROP TABLE IF EXISTS ceo;
CREATE TABLE ceo (
    id_ceo INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    document VARCHAR(100) UNIQUE NOT NULL,
    date_birth DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS owners;
CREATE TABLE owners (
    id_owner INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    nit VARCHAR(100) UNIQUE NOT NULL,
    date_birth DATE NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS hotels;
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
	
DROP TABLE IF EXISTS rooms;
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

DROP TABLE IF EXISTS activitys;
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

DROP TABLE IF EXISTS reserves;
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

DROP TABLE IF EXISTS reviews;
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

SELECT * FROM rooms;
SELECT * FROM reserves;
SELECT * FROM ceo;
SELECT * FROM users;
SELECT * FROM activitys;
SELECT * FROM owners;
SELECT * FROM hotels;
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

INSERT INTO ceo (email, password, role) VALUES
('admin@tournest.com', 'admin123', 'ceo');

INSERT INTO users (id_user, name, email, password, document, date_birth, phone, role) VALUES
(1, 'Yancelly Rojo', 'rojo@example.com', 'pass123', 'CC1001', '1990-05-12', '3001234567', 'user'),
(2, 'Jeronimo Cardenas', 'jero@example.com', 'pass123', 'CC1002', '1988-08-22', '3019876543', 'user'),
(3, 'Andrés Restrepo', 'andres@example.com', 'pass123', 'CC1003', '1995-11-03', '3024567890', 'user'),
(4, 'Stiven Hidalgo', 'stiven@example.com', 'pass123', 'CC1004', '1992-07-19', '3106547891', 'user');

INSERT INTO owners (id_owner, name, email, password, nit, date_birth, phone, role) VALUES
(5, 'Aviatur', 'aviatur@example.com', 'pass123', 'NIT900111', '1980-01-15', '3157896541', 'owner'),
(6, 'Despegar SAS', 'despegar@example.com', 'pass123', 'NIT900222', '1982-09-09', '3169873210', 'owner'),
(7, 'Decamerun', 'decamerun@example.com', 'pass123', 'NIT900333', '1980-09-09', '3000873210', 'owner'),
(8, 'Colombia Tours', 'coloTours@example.com', 'pass123', 'NIT900444', '1981-08-09', '3161113210', 'owner');

INSERT INTO hotels (id_owner, name, description, city, rating_average, img_url) VALUES
(5, 'Hotel Cartagena Dubai', 'Hotel de 4 estrellas con habitaciones sencillas con vista al mar, restaurante, bar y piscina infinita.', 'Cartagena', 4.0, 'https://dubai.cartagena-hotels.net/data/Pics/OriginalPhoto/12838/1283872/1283872078/hotel-cartagena-dubai-cartagena-pic-65.JPEG'),
(5, 'Hotel Decameron Aquarium', 'Complejo de edificios circulares sobre el mar, con 6 restaurantes y piscina, ideal para buceo y relajación.', 'San Andres', 3.4, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=900&h=-1&s=1'),
(5, 'Hotel Irotama Resort', 'Hotel con cabañas y bungalows frente al mar, reconocido por su entorno natural y amplias instalaciones.', 'Santa Marta', 4.5, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/23394561.jpg?k=f4a79ab34754a619b74d4e0cf22c383a1ff8fb135e83509f8444129014e89ae1&o=&hp=1'),
(5, 'The Click Clack Hotel', 'Hotel boutique en un edificio moderno con diseño innovador, famoso por su ambiente vibrante y animado.', 'Medellin', 4.6, 'https://media-cdn.tripadvisor.com/media/photo-s/1b/db/00/b2/the-click-clack-hotel.jpg'),
(6, 'Estelar Cartagena de Indias', 'Imponente hotel y centro de convenciones en Bocagrande con piscina infinita y vista panorámica al mar.', 'Cartagena', 4.4, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/487645706.jpg?k=8cb587485838e507312e4053dfe60e67114212953df8ee9cceb91e163580e8ca&o=&hp=1'),
(6, 'GHL Hotel Sunrise', 'Hotel con una gran piscina sobre el mar, que ofrece vistas increíbles y un ambiente relajado y tranquilo.', 'San Andres', 3.7, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/298757286.jpg?k=f5ea109103dd1e3bcb43a8af0b4b827636b41bf89a41820fbba8372e8ab4a3b4&o=&hp=1'),
(6, 'Mercure Santa Marta Emile', 'Hotel con un diseño minimalista y acogedor que ofrece una de las vistas más bellas de la ciudad, ideal para familias.', 'Santa Marta', 4.6, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/55779797.jpg?k=25b19e84c2ad3d8cfe74811165edc2d0e1458ab8771222d1ef04c47b83a94855&o=&hp=1'),
(6, 'Hotel El Poblado Plaza', 'Ubicado en el corazón de El Poblado, con habitaciones amplias y elegantes y un servicio destacado.', 'Medellin', 4.4, 'https://360radio.com.co/wp-content/uploads/2024/08/Hotel-Poblado-Plaza.webp'),
(7, 'Sofitel Legend Santa Clara', 'Un convento del siglo XVII transformado en un hotel de lujo, que fusiona historia con elegancia y confort moderno.', 'Cartagena', 4.7, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/d3/df/d1/hotel-sofitel-legend.jpg?w=900&h=500&s=1'),
(7, 'Hotel Casablanca', 'Hotel ubicado frente a la playa principal, conocido por su excelente ubicación y gastronomía variada.', 'San Andres', 4.0, 'https://www.atrapalo.com.co/hoteles/picture/l/1974/5/9/606910133.jpg'),
(7, 'Hotel Santorini Villas del Mar', 'Ofrece villas y apartamentos con piscina y jardín, ideal para familias o grupos que buscan privacidad.', 'Santa Marta', 4.1, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/378422179.jpg?k=1f23cb03bec2079f646acb47d459fb6a937ded3c9ae1ccdaff471efd5863da7b&o=&hp=1'),
(7, 'Hotel Dann Carlton Medellín', 'Hotel de 5 estrellas en El Poblado, con habitaciones de lujo, un spa completo y vistas a la ciudad.', 'Medellin', 4.4, 'https://image-tc.galaxy.tf/wijpeg-68zqza781erv6h4ds51tbincx/pool-hotel-dann-carlton-belfort-1.jpg?width=1920'),
(8, 'Hotel Las Américas Casa de Playa', 'Un gran resort familiar frente al mar con múltiples piscinas, amplias zonas verdes y un centro de convenciones.', 'Cartagena', 4.3, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/78716387.jpg?k=e80174a7ce0dd3b54a1c7f8451433eee9f2194780a76e01a1004b3ebcc85916e&o=&hp=1'),
(8, 'Hotel Sol Caribe Campo', 'Resort todo incluido en un entorno natural, con varias piscinas, restaurantes y actividades para toda la familia.', 'San Andres', 4.0, 'https://orion.grupowelcome.com.co/uploads/0000/6/2024/10/24/543589820.jpg'),
(8, 'Hotel GHL Relax Costa Azul', 'Hotel moderno y pet friendly con piscina y acceso a la playa, ideal para el descanso familiar.', 'Santa Marta', 4.4, 'https://www.ghlhoteles.com/uploads/galeriahoteles/home_horizontal_32ej3X9.jpg'),
(8, 'NH Collection Medellín Royal', 'Hotel de lujo con habitaciones elegantes y cómodas, ubicado en una zona exclusiva de la ciudad.', 'Medellin', 4.4, 'https://pix10.agoda.net/hotelImages/2677631/-1/5cf49ded6d1c774357ab9f744858d046.jpg?ca=20&ce=0&s=414x232');

INSERT INTO rooms (id_hotel, capacity, price, img_url, number_room, state) VALUES
(1, 4, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/fc/db/4f/vip-hotel.jpg?w=700&h=-1&s=1', '101', 'available'),
(2, 5, 250000, 'https://www.hotelsaliecho.com/wp-content/uploads/2022/06/H.-Saliecho-habitacion-VIP-2-copia-e1656592648997.jpg', '102', 'occupied'),
(3, 8, 200000, 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280', '201', 'available'),
(4, 5, 280000, 'https://media-cdn.tripadvisor.com/media/photo-s/06/ce/01/8d/vip.jpg', '202', 'occupied'),
(5, 3, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/b8/60/suite-hotels.jpg?w=1200&h=-1&s=1', '301', 'available'),
(6, 2, 250000, 'https://cdn.prod.website-files.com/5fd2691417e7999c4c5295a4/64653298c1c4411e9075e01f_junior-suite-el-cielo-hotel-1-min.jpg', '302', 'occupied'),
(7, 4, 200000, 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/19191518/800x-1-1.jpg', '401', 'available'),
(8, 5, 280000, 'https://images.trvl-media.com/lodging/49000000/49000000/48994600/48994574/a6bf68c0.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', '402', 'occupied'),
(9, 4, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/fc/db/4f/vip-hotel.jpg?w=700&h=-1&s=1', '101', 'available'),
(10, 5, 250000, 'https://www.hotelsaliecho.com/wp-content/uploads/2022/06/H.-Saliecho-habitacion-VIP-2-copia-e1656592648997.jpg', '102', 'occupied'),
(11, 8, 200000, 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280', '201', 'available'),
(12, 5, 280000, 'https://media-cdn.tripadvisor.com/media/photo-s/06/ce/01/8d/vip.jpg', '202', 'occupied'),
(13, 3, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/b8/60/suite-hotels.jpg?w=1200&h=-1&s=1', '301', 'available'),
(14, 2, 250000, 'https://cdn.prod.website-files.com/5fd2691417e7999c4c5295a4/64653298c1c4411e9075e01f_junior-suite-el-cielo-hotel-1-min.jpg', '302', 'occupied'),
(15, 4, 200000, 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/19191518/800x-1-1.jpg', '401', 'available'),
(16, 5, 280000, 'https://images.trvl-media.com/lodging/49000000/49000000/48994600/48994574/a6bf68c0.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', '402', 'occupied'),
(16, 4, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/fc/db/4f/vip-hotel.jpg?w=700&h=-1&s=1', '101', 'available'),
(15, 5, 250000, 'https://www.hotelsaliecho.com/wp-content/uploads/2022/06/H.-Saliecho-habitacion-VIP-2-copia-e1656592648997.jpg', '102', 'occupied'),
(14, 8, 200000, 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280', '201', 'available'),
(13, 5, 280000, 'https://media-cdn.tripadvisor.com/media/photo-s/06/ce/01/8d/vip.jpg', '202', 'occupied'),
(12, 3, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/b8/60/suite-hotels.jpg?w=1200&h=-1&s=1', '301', 'available'),
(11, 2, 250000, 'https://cdn.prod.website-files.com/5fd2691417e7999c4c5295a4/64653298c1c4411e9075e01f_junior-suite-el-cielo-hotel-1-min.jpg', '302', 'occupied'),
(10, 4, 200000, 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/19191518/800x-1-1.jpg', '401', 'available'),
(9, 5, 280000, 'https://images.trvl-media.com/lodging/49000000/49000000/48994600/48994574/a6bf68c0.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', '402', 'occupied'),
(8, 4, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/fc/db/4f/vip-hotel.jpg?w=700&h=-1&s=1', '101', 'available'),
(7, 5, 250000, 'https://www.hotelsaliecho.com/wp-content/uploads/2022/06/H.-Saliecho-habitacion-VIP-2-copia-e1656592648997.jpg', '102', 'occupied'),
(6, 8, 200000, 'https://image-tc.galaxy.tf/wijpeg-5srw8mjtza6abfwrpha1r5lmg/habitacion-special-double_standard.jpg?crop=107%2C0%2C1707%2C1280', '201', 'available'),
(5, 5, 280000, 'https://media-cdn.tripadvisor.com/media/photo-s/06/ce/01/8d/vip.jpg', '202', 'occupied'),
(4, 3, 150000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/b8/60/suite-hotels.jpg?w=1200&h=-1&s=1', '301', 'available'),
(3, 2, 250000, 'https://cdn.prod.website-files.com/5fd2691417e7999c4c5295a4/64653298c1c4411e9075e01f_junior-suite-el-cielo-hotel-1-min.jpg', '302', 'occupied'),
(2, 4, 200000, 'https://s3.amazonaws.com/arc-wordpress-client-uploads/infobae-wp/wp-content/uploads/2018/12/19191518/800x-1-1.jpg', '401', 'available'),
(1, 5, 280000, 'https://images.trvl-media.com/lodging/49000000/49000000/48994600/48994574/a6bf68c0.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill', '402', 'occupied');


INSERT INTO activitys (id_owner, name, description, price, duration, img_url, place, quota_available) VALUES
(5, 'Tour en Chiva Rumbera', 'Un divertido recorrido nocturno por la ciudad al ritmo de la música caribeña y los licores locales.', 60000, '4 horas', 'https://www.baytours.com.co/wp-content/uploads/2021/11/chiva_3997139_20201216111803.jpg', 'Cartagena, Bolívar', 30),
(5, 'Paseo en yate a las Islas del Rosario', 'Disfruta de las aguas cristalinas del Parque Nacional Corales del Rosario y Barú en un cómodo yate.', 300000, '8 horas', 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/c8/67/36.jpg', 'Islas del Rosario, Cartagena', 10),
(6, 'Buceo en el Acuario', 'Explora la vida marina de la isla buceando o haciendo snorkel en un acuario natural.', 150000, '3 horas', 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6e/d0/f4.jpg', 'El Acuario, San Andrés', 15),
(6, 'Tour de la isla en bicicleta', 'Recorre la isla de San Andrés en bicicleta, visitando puntos icónicos como El Hoyo Soplador y las playas de San Luis.', 40000, '5 horas', 'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/01/e3/3b.jpg', 'San Andrés, San Andrés', 12),
(7, 'Senderismo en el Parque Tayrona', 'Aventura de caminata por senderos selváticos para llegar a playas paradisíacas como Cabo San Juan del Guía.', 60000, '6 horas', 'https://daleunavueltaalmundo.com/wp-content/uploads/2024/06/camino-arrecifes-tayrona.webp', 'Parque Tayrona, Santa Marta', 25),
(7, 'City Tour en Medellín', 'Explora el centro de la ciudad, los grafitis de la Comuna 13 y el sistema de Metrocable, una obra de transformación social.', 150000, '5 horas', 'https://www.bogotraveltours.com/wp-content/uploads/City-tours-Medellin-1.jpg', 'Medellín, Antioquia', 20),
(8, 'Avistamiento de ballenas', 'Una experiencia inolvidable para observar las ballenas jorobadas en su migración por las aguas del Pacífico colombiano.', 350000, '4 horas', 'https://agenciadeviajesviva365.com/wp-content/uploads/2024/07/Tour-avistamiento-de-ballenas-valle-del-cauca.jpg', 'Bahía Solano, Chocó', 8),
(8, 'Recorrido del café', 'Descubre el proceso de producción del café, desde la siembra hasta la taza, en una finca tradicional del Eje Cafetero.', 80000, '3 horas', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/7b/17/a5/caption.jpg?w=500&h=400&s=1', 'Salento, Quindío', 18);

INSERT INTO reserves (id_user, id_room, id_activity, date_init, date_end, state) VALUES
(1, 25, NULL, '2025-10-01', '2025-10-05', 'confirmed'),
(3, NULL, 4, '2025-10-10', '2025-10-10', 'pending'),
(2, 12, NULL, '2025-11-20', '2025-11-24', 'confirmed'),
(4, NULL, 6, '2025-12-03', '2025-12-03', 'canceled'),
(1, 1, NULL, '2026-01-08', '2026-01-12', 'pending'),
(3, 29, NULL, '2026-02-15', '2026-02-17', 'confirmed'),
(2, NULL, 1, '2026-03-25', '2026-03-25', 'confirmed'),
(4, 32, NULL, '2026-04-10', '2026-04-14', 'pending'),
(1, NULL, 3, '2026-05-01', '2026-05-01', 'canceled'),
(2, 5, NULL, '2026-06-05', '2026-06-08', 'confirmed');

INSERT INTO reviews (id_user, id_hotel, id_activity, comment, rating) VALUES
(1, 15, NULL, 'El hotel superó mis expectativas, el personal fue muy atento.', 5),
(2, NULL, 4, 'La actividad fue genial, aunque el precio me pareció un poco alto.', 4),
(3, 8, NULL, 'Habitación limpia y cómoda. Volvería sin dudarlo.', 5),
(4, NULL, 2, 'No quedé satisfecho con la atención. El equipo parecía desorganizado.', 2),
(1, 16, NULL, 'La piscina estaba fuera de servicio y no nos avisaron. Muy decepcionado.', 2),
(3, NULL, 6, 'El guía era un experto, se notaba su pasión. Una experiencia enriquecedora.', 5),
(2, 2, NULL, 'Un hotel normal, nada destacable pero cumple con lo prometido.', 3),
(4, NULL, 1, 'El tour fue muy largo y aburrido, esperaba más del recorrido.', 1),
(1, 11, NULL, 'Excelente relación calidad-precio. Desayuno incluido delicioso.', 4),
(4, 13, NULL, 'El servicio a la habitación fue lento y se equivocaron en mi pedido.', 3);






