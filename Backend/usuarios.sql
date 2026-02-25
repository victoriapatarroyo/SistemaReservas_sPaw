-- Script para insertar 15 registros en la tabla usuario
INSERT INTO usuario (telefono, apellido, nombre, email, password_usuario, rol) VALUES
('3001234567', 'García', 'Juan', 'juan.garcia@email.com', 'Pass..123', 'Cliente'),
('3009876543', 'Rodríguez', 'María', 'maria.rodriguez@email.com', 'Pass..456', 'Cliente'),
('3012345678', 'Martínez', 'Carlos', 'carlos.martinez@email.com', 'Pass..789', 'Administrador'),
('3018765432', 'López', 'Ana', 'ana.lopez@email.com', 'Pass..321', 'Cliente'),
('3023456789', 'González', 'Pedro', 'pedro.gonzalez@email.com', 'Pass..654', 'Administrador'),
('3034567890', 'Pérez', 'Laura', 'laura.perez@email.com', 'Pass..987', 'Cliente'),
('3045678901', 'Sánchez', 'Diego', 'diego.sanchez@email.com', 'Pass..147', 'Cliente'),
('3056789012', 'Ramírez', 'Sofia', 'sofia.ramirez@email.com', 'Pass..258', 'Cliente'),
('3067890123', 'Torres', 'Miguel', 'miguel.torres@email.com', 'Pass..369', 'Cliente'),
('3078901234', 'Flores', 'Carmen', 'carmen.flores@email.com', 'Pass..741', 'Cliente'),
('3089012345', 'Rivera', 'Jorge', 'jorge.rivera@email.com', 'Pass..852', 'Cliente'),
('3090123456', 'Gómez', 'Patricia', 'patricia.gomez@email.com', 'Pass..963', 'Cliente'),
('3101234567', 'Díaz', 'Roberto', 'roberto.diaz@email.com', 'Pass..159', 'Cliente'),
('3112345678', 'Vargas', 'Andrea', 'andrea.vargas@email.com', 'Pass..357', 'Administrador'),
('3123456789', 'Castro', 'Luis', 'luis.castro@email.com', 'Pass..753', 'Cliente');


-- Script de inserción de 15 mascotas
INSERT INTO mascota (id_usuario, nombre_mascota) VALUES
(1, 'Max'),
(2, 'Luna'),
(3, 'Rocky'),
(4, 'Bella'),
(5, 'Charlie'),
(1, 'Milo'),
(2, 'Simba'),
(6, 'Toby'),
(7, 'Chloe'),
(3, 'Bruno'),
(8, 'Nala'),
(4, 'Zeus'),
(9, 'Lola'),
(10, 'Cooper'),
(5, 'Daisy');

INSERT INTO groomer (nombre, apellido, telefono, email) VALUES
('Laura', 'Martínez', '3001234567', 'laura.martinez@spaw.com'),
('Carlos', 'Rodríguez', '3102345678', 'carlos.rodriguez@spaw.com'),
('Ana', 'García', '3203456789', 'ana.garcia@spaw.com'),
('Miguel', 'López', '3304567890', 'miguel.lopez@spaw.com'),
('Sofía', 'Hernández', '3405678901', 'sofia.hernandez@spaw.com');

INSERT INTO servicio 
(nombre, descripcion, precio_tam_pequeno, precio_tam_mediano, precio_tam_grande) VALUES
('Baño básico',  'Baño con shampoo hipoalergénico, secado y cepillado básico.', 30000, 40000, 50000),
('Baño medicado',  'Baño con shampoo medicado recomendado por veterinario.', 35000, 45000, 60000),
('Corte de uñas',  'Corte y limado de uñas para mayor comodidad y salud.', 15000, 20000, 25000),
('Limpieza de oídos',  'Limpieza profunda de oídos con productos especializados.', 12000, 18000, 22000),
('Cepillado profundo',  'Cepillado para remover pelo muerto y evitar nudos.', 20000, 30000, 40000),
('Corte de pelo estándar',  'Corte de pelo según la raza o preferencia del cliente.', 40000, 55000, 70000),
('Corte higiénico',  'Corte en zonas íntimas, patas y rostro.', 25000, 35000, 45000),
('Deslanado', 'Tratamiento para eliminar exceso de subpelo.', 35000, 50000, 65000),
('Tratamiento antipulgas',  'Aplicación de productos antipulgas y garrapatas.', 30000, 45000, 60000),
('Spa relajante',  'Incluye baño, masaje relajante y aromaterapia canina.', 50000, 70000, 90000);


INSERT INTO reserva 
(fecha, hora_final, hora_inicio, id_groomer, id_mascota, id_servicio)
VALUES
('2025-01-10', '10:00:00', '09:00:00', 1, 1, 1),
('2025-01-10', '11:30:00', '10:00:00', 2, 2, 2),
('2025-01-10', '12:30:00', '11:00:00', 3, 3, 3),
('2025-01-11', '10:30:00', '09:00:00', 4, 4, 4),
('2025-01-11', '12:00:00', '10:30:00', 5, 5, 5),

('2025-01-12', '10:00:00', '09:00:00', 1, 6, 2),
('2025-01-12', '11:30:00', '10:00:00', 2, 7, 3),
('2025-01-12', '13:00:00', '11:30:00', 3, 8, 4),
('2025-01-13', '10:30:00', '09:00:00', 4, 9, 5),
('2025-01-13', '12:00:00', '10:30:00', 5, 10, 6),

('2025-01-14', '10:30:00', '09:00:00', 1, 1, 3),
('2025-01-14', '12:00:00', '10:30:00', 2, 2, 4),
('2025-01-14', '13:30:00', '12:00:00', 3, 3, 5),
('2025-01-15', '10:00:00', '09:00:00', 4, 4, 6),
('2025-01-15', '11:00:00', '10:00:00', 5, 5, 1),

('2025-01-16', '10:30:00', '09:00:00', 1, 6, 4),
('2025-01-16', '12:00:00', '10:30:00', 2, 7, 5),
('2025-01-16', '13:00:00', '12:00:00', 3, 8, 6),
('2025-01-17', '10:00:00', '09:00:00', 4, 9, 1),
('2025-01-17', '11:30:00', '10:00:00', 5, 10, 2);
