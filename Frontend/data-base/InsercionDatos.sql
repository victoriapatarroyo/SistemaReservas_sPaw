INSERT INTO groomer (nombre, apellido, telefono, email) VALUES
('Laura', 'Gómez', '3004567890', 'laura.gomez@groomerspaw.com'),
('Andrés', 'Martínez', '3105678901', 'andres.martinez@groomerspaw.com'),
('Camila', 'Rodríguez', '3206789012', 'camila.rodriguez@groomerspaw.com'),
('Daniel', 'Pérez', '3017890123', 'daniel.perez@groomerspaw.com'),
('Valentina', 'Hernández', '3158901234', 'valentina.hernandez@groomerspaw.com');


INSERT INTO usuario (nombre, apellido, telefono, email, passwordUsuario, rol) VALUES
('Carlos','Ramirez','3001112233','carlos@correo.com','$2a$10$hash1','Cliente'),
('Ana','Gomez','3002223344','ana@correo.com','$2a$10$hash2','Cliente'),
('Luis','Perez','3003334455','luis@correo.com','$2a$10$hash3','Cliente'),
('Maria','Lopez','3004445566','maria@correo.com','$2a$10$hash4','Cliente'),
('Juan','Torres','3005556677','juan@correo.com','$2a$10$hash5','Cliente'),
('Laura','Diaz','3006667788','laura@correo.com','$2a$10$hash6','Cliente'),
('Pedro','Martinez','3007778899','pedro@correo.com','$2a$10$hash7','Cliente'),
('Sofia','Castro','3008889900','sofia@correo.com','$2a$10$hash8','Cliente'),
('Andres','Vargas','3009990011','andres@correo.com','$2a$10$hash9','Administrador'),
('Paula','Rios','3010001122','paula@correo.com','$2a$10$hash10','Cliente');

INSERT INTO servicio (nombre, descripcion, precioTamPequeno, precioTamMediano, precioTamGrande) VALUES
('Combo Baño Básico', 'Baño con shampoo neutro, secado profesional, limpieza de oídos y corte de uñas. Ideal para mantener la higiene regular.',
35000, 45000, 55000),
('Combo Grooming Completo', 'Baño, secado y corte de pelo según raza o preferencia, perfilado de rostro y patas, corte de uñas y colonia hipoalergénica.',
60000, 75000, 95000),
('Combo Antipulgas Total', 'Baño antipulgas y antigarrapatas, limpieza profunda de oídos, corte de uñas y revisión completa de piel.',
40000, 50000, 65000),
('Combo Dental & Limpieza de Oídos', 'Cepillado dental básico, limpieza profunda de oídos, corte de uñas y cepillado de pelaje.',
30000, 40000, 50000),
('Combo Deslanado Básico', 'Baño, secado y cepillado intensivo para eliminar pelo muerto, limpieza de oídos y corte de uñas.',
45000, 55000, 70000),
('Combo Mantenimiento Express', 'Corte de uñas, limpieza de oídos, perfumado ligero y cepillado rápido. Ideal entre baños.',
20000, 25000, 30000),
('Combo Hidratación Básica', 'Baño con shampoo hidratante, acondicionador nutritivo, secado profesional y corte de uñas.',
40000, 50000, 65000),
('Combo Revisión & Limpieza', 'Revisión general superficial, limpieza de oídos, corte de uñas y cepillado profundo.',
25000, 30000, 40000),
('Combo Cachorro (Primer Spaw)', 'Baño suave para cachorro, secado delicado, cepillado ligero, limpieza de oídos y desensibilización al equipo.',
50000, 50000, 50000),
('Combo Spaw Premium - Día de Relajación', 'Servicio de lujo con baño aromático, masaje relajante, hidratación profunda, perfumado y obsequio.',
85000, 110000, 140000);


INSERT INTO mascota (nombreMascota, idUsuario) VALUES
-- Mascotas para Carlos Ramirez (idUsuario=1)
('Max', 1),
('Luna', 1),
('Rocky', 1),
 
-- Mascotas para Ana Gomez (idUsuario=2)
('Bella', 2),
('Simba', 2),
('Coco', 2),
('Nina', 2),
 
-- Mascotas para Luis Perez (idUsuario=3)
('Thor', 3),
('Lola', 3),
('Milo', 3),
 
-- Mascotas para Maria Lopez (idUsuario=4)
('Toby', 4),
('Molly', 4),
('Zeus', 4),
('Daisy', 4),
 
-- Mascotas para Juan Torres (idUsuario=5)
('Bruno', 5),
('Lucky', 5),
('Rex', 5),
('Kiara', 5),
 
-- Mascotas para Laura Diaz (idUsuario=6)
('Jack', 6),
('Chloe', 6),
('Oso', 6),
('Mia', 6),
 
-- Mascotas para Pedro Martinez (idUsuario=7)
('Charlie', 7),
('Lily', 7),
('Bruno', 7),
('Zoe', 7),
 
-- Mascotas para Sofia Castro (idUsuario=8)
('Toby', 8),
('Luna', 8),
('Max', 8),
 
-- Mascotas para Paula Rios (idUsuario=10)
('Bobby', 10),
('Maya', 10),
('Rocco', 10),
('Lola', 10);


-- Script de inserción de datos para tabla reserva
-- Reservas distribuidas entre enero y marzo de 2026

INSERT INTO reserva (idGroomer, idServicio, idMascota, fecha, horaInicio, horaFinal) VALUES
-- Enero 2026
(1, 1, 1, '2026-01-10', '08:00:00', '09:30:00'),
(2, 2, 4, '2026-01-10', '09:00:00', '11:00:00'),
(3, 3, 8, '2026-01-10', '10:00:00', '11:30:00'),
(1, 4, 12, '2026-01-11', '08:30:00', '10:00:00'),
(4, 5, 15, '2026-01-11', '11:00:00', '13:00:00'),
(5, 1, 19, '2026-01-12', '09:00:00', '10:30:00'),
(2, 6, 22, '2026-01-13', '08:00:00', '09:00:00'),
(3, 7, 25, '2026-01-13', '10:30:00', '12:30:00'),
(1, 2, 2, '2026-01-15', '14:00:00', '16:00:00'),
(4, 8, 5, '2026-01-15', '15:00:00', '16:30:00'),

-- Enero - Semana 3
(5, 9, 9, '2026-01-17', '08:00:00', '09:30:00'),
(1, 10, 13, '2026-01-17', '10:00:00', '12:30:00'),
(2, 1, 16, '2026-01-18', '09:30:00', '11:00:00'),
(3, 3, 20, '2026-01-19', '11:00:00', '12:30:00'),
(4, 2, 23, '2026-01-20', '08:00:00', '10:00:00'),
(5, 4, 26, '2026-01-20', '13:00:00', '14:30:00'),
(1, 5, 3, '2026-01-22', '09:00:00', '11:00:00'),
(2, 1, 6, '2026-01-22', '14:00:00', '15:30:00'),
(3, 6, 10, '2026-01-24', '08:30:00', '09:30:00'),
(4, 7, 14, '2026-01-24', '10:00:00', '12:00:00'),

-- Enero - Semana 4
(5, 2, 17, '2026-01-25', '15:00:00', '17:00:00'),
(1, 8, 21, '2026-01-26', '08:00:00', '09:30:00'),
(2, 3, 24, '2026-01-27', '11:00:00', '12:30:00'),
(3, 9, 27, '2026-01-27', '09:00:00', '10:30:00'),
(4, 1, 28, '2026-01-29', '13:00:00', '14:30:00'),

-- Febrero 2026
(5, 10, 7, '2026-02-01', '10:00:00', '12:30:00'),
(1, 1, 11, '2026-02-02', '08:00:00', '09:30:00'),
(2, 2, 18, '2026-02-03', '14:00:00', '16:00:00'),
(3, 4, 29, '2026-02-03', '09:00:00', '10:30:00'),
(4, 5, 30, '2026-02-05', '11:00:00', '13:00:00'),

-- Febrero - Semana 2
(5, 1, 1, '2026-02-07', '08:30:00', '10:00:00'),
(1, 3, 4, '2026-02-08', '10:00:00', '11:30:00'),
(2, 6, 8, '2026-02-09', '13:00:00', '14:00:00'),
(3, 7, 12, '2026-02-09', '15:00:00', '17:00:00'),
(4, 2, 15, '2026-02-10', '08:00:00', '10:00:00'),
(5, 8, 19, '2026-02-11', '09:30:00', '11:00:00'),
(1, 1, 22, '2026-02-12', '14:00:00', '15:30:00'),
(2, 9, 25, '2026-02-13', '08:00:00', '09:30:00'),
(3, 2, 2, '2026-02-14', '10:00:00', '12:00:00'),
(4, 4, 5, '2026-02-14', '15:00:00', '16:30:00'),

-- Febrero - Semana 3
(5, 5, 9, '2026-02-16', '09:00:00', '11:00:00'),
(1, 1, 13, '2026-02-17', '08:00:00', '09:30:00'),
(2, 10, 16, '2026-02-17', '11:00:00', '13:30:00'),
(3, 3, 20, '2026-02-18', '14:00:00', '15:30:00'),
(4, 6, 23, '2026-02-19', '08:30:00', '09:30:00'),
(5, 1, 26, '2026-02-20', '10:00:00', '11:30:00'),
(1, 7, 3, '2026-02-21', '13:00:00', '15:00:00'),
(2, 2, 6, '2026-02-22', '09:00:00', '11:00:00'),
(3, 8, 10, '2026-02-23', '08:00:00', '09:30:00'),
(4, 1, 14, '2026-02-24', '14:00:00', '15:30:00'),

-- Febrero - Semana 4
(5, 4, 17, '2026-02-25', '10:00:00', '11:30:00'),
(1, 2, 21, '2026-02-26', '08:00:00', '10:00:00'),
(2, 5, 24, '2026-02-27', '11:00:00', '13:00:00'),
(3, 1, 27, '2026-02-28', '15:00:00', '16:30:00'),

-- Marzo 2026
(4, 9, 28, '2026-03-02', '08:00:00', '09:30:00'),
(5, 1, 7, '2026-03-03', '10:00:00', '11:30:00'),
(1, 3, 11, '2026-03-03', '13:00:00', '14:30:00'),
(2, 2, 18, '2026-03-04', '09:00:00', '11:00:00'),
(3, 10, 29, '2026-03-05', '14:00:00', '16:30:00'),
(4, 6, 30, '2026-03-06', '08:30:00', '09:30:00'),

-- Marzo - Semana 2
(5, 1, 1, '2026-03-07', '10:00:00', '11:30:00'),
(1, 7, 4, '2026-03-08', '15:00:00', '17:00:00'),
(2, 4, 8, '2026-03-09', '08:00:00', '09:30:00'),
(3, 1, 12, '2026-03-10', '11:00:00', '12:30:00'),
(4, 8, 15, '2026-03-10', '14:00:00', '15:30:00'),
(5, 2, 19, '2026-03-11', '09:00:00', '11:00:00'),
(1, 5, 22, '2026-03-12', '08:00:00', '10:00:00'),
(2, 1, 25, '2026-03-13', '13:00:00', '14:30:00'),
(3, 3, 2, '2026-03-14', '10:00:00', '11:30:00'),
(4, 9, 5, '2026-03-14', '15:00:00', '16:30:00'),

-- Marzo - Semana 3
(5, 1, 9, '2026-03-16', '08:00:00', '09:30:00'),
(1, 6, 13, '2026-03-17', '10:00:00', '11:00:00'),
(2, 2, 16, '2026-03-17', '14:00:00', '16:00:00'),
(3, 10, 20, '2026-03-18', '09:00:00', '11:30:00'),
(4, 4, 23, '2026-03-19', '11:00:00', '12:30:00'),
(5, 7, 26, '2026-03-20', '13:00:00', '15:00:00'),
(1, 1, 3, '2026-03-21', '08:00:00', '09:30:00'),
(2, 8, 6, '2026-03-22', '10:00:00', '11:30:00'),
(3, 2, 10, '2026-03-23', '15:00:00', '17:00:00'),
(4, 5, 14, '2026-03-24', '09:00:00', '11:00:00'),

-- Marzo - Semana 4
(5, 1, 17, '2026-03-25', '08:00:00', '09:30:00'),
(1, 3, 21, '2026-03-26', '11:00:00', '12:30:00'),
(2, 1, 24, '2026-03-27', '14:00:00', '15:30:00'),
(3, 6, 27, '2026-03-28', '08:30:00', '09:30:00'),
(4, 2, 28, '2026-03-29', '10:00:00', '12:00:00'),
(5, 9, 7, '2026-03-30', '13:00:00', '14:30:00'),
(1, 4, 11, '2026-03-31', '09:00:00', '10:30:00');