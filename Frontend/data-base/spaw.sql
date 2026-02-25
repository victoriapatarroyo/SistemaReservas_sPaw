-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 08-01-2026 a las 20:17:37
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `spaw`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `groomer`
--

DROP TABLE IF EXISTS `groomer`;
CREATE TABLE IF NOT EXISTS `groomer` (
  `idGroomer` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idGroomer`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `groomer`
--

INSERT INTO `groomer` (`idGroomer`, `nombre`, `apellido`, `telefono`, `email`) VALUES
(1, 'Laura', 'Gómez', '3004567890', 'laura.gomez@groomerspaw.com'),
(2, 'Andrés', 'Martínez', '3105678901', 'andres.martinez@groomerspaw.com'),
(3, 'Camila', 'Rodríguez', '3206789012', 'camila.rodriguez@groomerspaw.com'),
(4, 'Daniel', 'Pérez', '3017890123', 'daniel.perez@groomerspaw.com'),
(5, 'Valentina', 'Hernández', '3158901234', 'valentina.hernandez@groomerspaw.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

DROP TABLE IF EXISTS `mascota`;
CREATE TABLE IF NOT EXISTS `mascota` (
  `idMascota` int NOT NULL AUTO_INCREMENT,
  `nombreMascota` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idUsuario` int DEFAULT NULL,
  PRIMARY KEY (`idMascota`),
  KEY `idUsuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`idMascota`, `nombreMascota`, `idUsuario`) VALUES
(1, 'Max', 1),
(2, 'Luna', 1),
(3, 'Rocky', 1),
(4, 'Bella', 2),
(5, 'Simba', 2),
(6, 'Coco', 2),
(7, 'Nina', 2),
(8, 'Thor', 3),
(9, 'Lola', 3),
(10, 'Milo', 3),
(11, 'Toby', 4),
(12, 'Molly', 4),
(13, 'Zeus', 4),
(14, 'Daisy', 4),
(15, 'Bruno', 5),
(16, 'Lucky', 5),
(17, 'Rex', 5),
(18, 'Kiara', 5),
(19, 'Jack', 6),
(20, 'Chloe', 6),
(21, 'Oso', 6),
(22, 'Mia', 6),
(23, 'Charlie', 7),
(24, 'Lily', 7),
(25, 'Bruno', 7),
(26, 'Zoe', 7),
(27, 'Toby', 8),
(28, 'Luna', 8),
(29, 'Max', 8),
(30, 'Bobby', 10),
(31, 'Maya', 10),
(32, 'Rocco', 10),
(33, 'Lola', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

DROP TABLE IF EXISTS `reserva`;
CREATE TABLE IF NOT EXISTS `reserva` (
  `idReserva` int NOT NULL AUTO_INCREMENT,
  `idGroomer` int NOT NULL,
  `idServicio` int NOT NULL,
  `idMascota` int NOT NULL,
  `fecha` date NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFinal` time NOT NULL,
  PRIMARY KEY (`idReserva`),
  KEY `idGroomer` (`idGroomer`),
  KEY `idServicio` (`idServicio`),
  KEY `idMascota` (`idMascota`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`idReserva`, `idGroomer`, `idServicio`, `idMascota`, `fecha`, `horaInicio`, `horaFinal`) VALUES
(1, 1, 1, 1, '2026-01-10', '08:00:00', '09:30:00'),
(2, 2, 2, 4, '2026-01-10', '09:00:00', '11:00:00'),
(3, 3, 3, 8, '2026-01-10', '10:00:00', '11:30:00'),
(4, 1, 4, 12, '2026-01-11', '08:30:00', '10:00:00'),
(5, 4, 5, 15, '2026-01-11', '11:00:00', '13:00:00'),
(6, 5, 1, 19, '2026-01-12', '09:00:00', '10:30:00'),
(7, 2, 6, 22, '2026-01-13', '08:00:00', '09:00:00'),
(8, 3, 7, 25, '2026-01-13', '10:30:00', '12:30:00'),
(9, 1, 2, 2, '2026-01-15', '14:00:00', '16:00:00'),
(10, 4, 8, 5, '2026-01-15', '15:00:00', '16:30:00'),
(11, 5, 9, 9, '2026-01-17', '08:00:00', '09:30:00'),
(12, 1, 10, 13, '2026-01-17', '10:00:00', '12:30:00'),
(13, 2, 1, 16, '2026-01-18', '09:30:00', '11:00:00'),
(14, 3, 3, 20, '2026-01-19', '11:00:00', '12:30:00'),
(15, 4, 2, 23, '2026-01-20', '08:00:00', '10:00:00'),
(16, 5, 4, 26, '2026-01-20', '13:00:00', '14:30:00'),
(17, 1, 5, 3, '2026-01-22', '09:00:00', '11:00:00'),
(18, 2, 1, 6, '2026-01-22', '14:00:00', '15:30:00'),
(19, 3, 6, 10, '2026-01-24', '08:30:00', '09:30:00'),
(20, 4, 7, 14, '2026-01-24', '10:00:00', '12:00:00'),
(21, 5, 2, 17, '2026-01-25', '15:00:00', '17:00:00'),
(22, 1, 8, 21, '2026-01-26', '08:00:00', '09:30:00'),
(23, 2, 3, 24, '2026-01-27', '11:00:00', '12:30:00'),
(24, 3, 9, 27, '2026-01-27', '09:00:00', '10:30:00'),
(25, 4, 1, 28, '2026-01-29', '13:00:00', '14:30:00'),
(26, 5, 10, 7, '2026-02-01', '10:00:00', '12:30:00'),
(27, 1, 1, 11, '2026-02-02', '08:00:00', '09:30:00'),
(28, 2, 2, 18, '2026-02-03', '14:00:00', '16:00:00'),
(29, 3, 4, 29, '2026-02-03', '09:00:00', '10:30:00'),
(30, 4, 5, 30, '2026-02-05', '11:00:00', '13:00:00'),
(31, 5, 1, 1, '2026-02-07', '08:30:00', '10:00:00'),
(32, 1, 3, 4, '2026-02-08', '10:00:00', '11:30:00'),
(33, 2, 6, 8, '2026-02-09', '13:00:00', '14:00:00'),
(34, 3, 7, 12, '2026-02-09', '15:00:00', '17:00:00'),
(35, 4, 2, 15, '2026-02-10', '08:00:00', '10:00:00'),
(36, 5, 8, 19, '2026-02-11', '09:30:00', '11:00:00'),
(37, 1, 1, 22, '2026-02-12', '14:00:00', '15:30:00'),
(38, 2, 9, 25, '2026-02-13', '08:00:00', '09:30:00'),
(39, 3, 2, 2, '2026-02-14', '10:00:00', '12:00:00'),
(40, 4, 4, 5, '2026-02-14', '15:00:00', '16:30:00'),
(41, 5, 5, 9, '2026-02-16', '09:00:00', '11:00:00'),
(42, 1, 1, 13, '2026-02-17', '08:00:00', '09:30:00'),
(43, 2, 10, 16, '2026-02-17', '11:00:00', '13:30:00'),
(44, 3, 3, 20, '2026-02-18', '14:00:00', '15:30:00'),
(45, 4, 6, 23, '2026-02-19', '08:30:00', '09:30:00'),
(46, 5, 1, 26, '2026-02-20', '10:00:00', '11:30:00'),
(47, 1, 7, 3, '2026-02-21', '13:00:00', '15:00:00'),
(48, 2, 2, 6, '2026-02-22', '09:00:00', '11:00:00'),
(49, 3, 8, 10, '2026-02-23', '08:00:00', '09:30:00'),
(50, 4, 1, 14, '2026-02-24', '14:00:00', '15:30:00'),
(51, 5, 4, 17, '2026-02-25', '10:00:00', '11:30:00'),
(52, 1, 2, 21, '2026-02-26', '08:00:00', '10:00:00'),
(53, 2, 5, 24, '2026-02-27', '11:00:00', '13:00:00'),
(54, 3, 1, 27, '2026-02-28', '15:00:00', '16:30:00'),
(55, 4, 9, 28, '2026-03-02', '08:00:00', '09:30:00'),
(56, 5, 1, 7, '2026-03-03', '10:00:00', '11:30:00'),
(57, 1, 3, 11, '2026-03-03', '13:00:00', '14:30:00'),
(58, 2, 2, 18, '2026-03-04', '09:00:00', '11:00:00'),
(59, 3, 10, 29, '2026-03-05', '14:00:00', '16:30:00'),
(60, 4, 6, 30, '2026-03-06', '08:30:00', '09:30:00'),
(61, 5, 1, 1, '2026-03-07', '10:00:00', '11:30:00'),
(62, 1, 7, 4, '2026-03-08', '15:00:00', '17:00:00'),
(63, 2, 4, 8, '2026-03-09', '08:00:00', '09:30:00'),
(64, 3, 1, 12, '2026-03-10', '11:00:00', '12:30:00'),
(65, 4, 8, 15, '2026-03-10', '14:00:00', '15:30:00'),
(66, 5, 2, 19, '2026-03-11', '09:00:00', '11:00:00'),
(67, 1, 5, 22, '2026-03-12', '08:00:00', '10:00:00'),
(68, 2, 1, 25, '2026-03-13', '13:00:00', '14:30:00'),
(69, 3, 3, 2, '2026-03-14', '10:00:00', '11:30:00'),
(70, 4, 9, 5, '2026-03-14', '15:00:00', '16:30:00'),
(71, 5, 1, 9, '2026-03-16', '08:00:00', '09:30:00'),
(72, 1, 6, 13, '2026-03-17', '10:00:00', '11:00:00'),
(73, 2, 2, 16, '2026-03-17', '14:00:00', '16:00:00'),
(74, 3, 10, 20, '2026-03-18', '09:00:00', '11:30:00'),
(75, 4, 4, 23, '2026-03-19', '11:00:00', '12:30:00'),
(76, 5, 7, 26, '2026-03-20', '13:00:00', '15:00:00'),
(77, 1, 1, 3, '2026-03-21', '08:00:00', '09:30:00'),
(78, 2, 8, 6, '2026-03-22', '10:00:00', '11:30:00'),
(79, 3, 2, 10, '2026-03-23', '15:00:00', '17:00:00'),
(80, 4, 5, 14, '2026-03-24', '09:00:00', '11:00:00'),
(81, 5, 1, 17, '2026-03-25', '08:00:00', '09:30:00'),
(82, 1, 3, 21, '2026-03-26', '11:00:00', '12:30:00'),
(83, 2, 1, 24, '2026-03-27', '14:00:00', '15:30:00'),
(84, 3, 6, 27, '2026-03-28', '08:30:00', '09:30:00'),
(85, 4, 2, 28, '2026-03-29', '10:00:00', '12:00:00'),
(86, 5, 9, 7, '2026-03-30', '13:00:00', '14:30:00'),
(87, 1, 4, 11, '2026-03-31', '09:00:00', '10:30:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

DROP TABLE IF EXISTS `servicio`;
CREATE TABLE IF NOT EXISTS `servicio` (
  `idServicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precioTamPequeno` double NOT NULL,
  `precioTamMediano` double NOT NULL,
  `precioTamGrande` double NOT NULL,
  PRIMARY KEY (`idServicio`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`idServicio`, `nombre`, `descripcion`, `precioTamPequeno`, `precioTamMediano`, `precioTamGrande`) VALUES
(1, 'Combo Baño Básico', 'Baño con shampoo neutro, secado profesional, limpieza de oídos y corte de uñas. Ideal para mantener la higiene regular.', 35000, 45000, 55000),
(2, 'Combo Grooming Completo', 'Baño, secado y corte de pelo según raza o preferencia, perfilado de rostro y patas, corte de uñas y colonia hipoalergénica.', 60000, 75000, 95000),
(3, 'Combo Antipulgas Total', 'Baño antipulgas y antigarrapatas, limpieza profunda de oídos, corte de uñas y revisión completa de piel.', 40000, 50000, 65000),
(4, 'Combo Dental & Limpieza de Oídos', 'Cepillado dental básico, limpieza profunda de oídos, corte de uñas y cepillado de pelaje.', 30000, 40000, 50000),
(5, 'Combo Deslanado Básico', 'Baño, secado y cepillado intensivo para eliminar pelo muerto, limpieza de oídos y corte de uñas.', 45000, 55000, 70000),
(6, 'Combo Mantenimiento Express', 'Corte de uñas, limpieza de oídos, perfumado ligero y cepillado rápido. Ideal entre baños.', 20000, 25000, 30000),
(7, 'Combo Hidratación Básica', 'Baño con shampoo hidratante, acondicionador nutritivo, secado profesional y corte de uñas.', 40000, 50000, 65000),
(8, 'Combo Revisión & Limpieza', 'Revisión general superficial, limpieza de oídos, corte de uñas y cepillado profundo.', 25000, 30000, 40000),
(9, 'Combo Cachorro (Primer Spaw)', 'Baño suave para cachorro, secado delicado, cepillado ligero, limpieza de oídos y desensibilización al equipo.', 50000, 50000, 50000),
(10, 'Combo Spaw Premium - Día de Relajación', 'Servicio de lujo con baño aromático, masaje relajante, hidratación profunda, perfumado y obsequio.', 85000, 110000, 140000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordUsuario` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('Cliente','Administrador') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `nombre`, `apellido`, `telefono`, `email`, `passwordUsuario`, `rol`) VALUES
(1, 'Carlos', 'Ramirez', '3001112233', 'carlos@correo.com', '$2a$10$hash1', 'Cliente'),
(2, 'Ana', 'Gomez', '3002223344', 'ana@correo.com', '$2a$10$hash2', 'Cliente'),
(3, 'Luis', 'Perez', '3003334455', 'luis@correo.com', '$2a$10$hash3', 'Cliente'),
(4, 'Maria', 'Lopez', '3004445566', 'maria@correo.com', '$2a$10$hash4', 'Cliente'),
(5, 'Juan', 'Torres', '3005556677', 'juan@correo.com', '$2a$10$hash5', 'Cliente'),
(6, 'Laura', 'Diaz', '3006667788', 'laura@correo.com', '$2a$10$hash6', 'Cliente'),
(7, 'Pedro', 'Martinez', '3007778899', 'pedro@correo.com', '$2a$10$hash7', 'Cliente'),
(8, 'Sofia', 'Castro', '3008889900', 'sofia@correo.com', '$2a$10$hash8', 'Cliente'),
(9, 'Andres', 'Vargas', '3009990011', 'andres@correo.com', '$2a$10$hash9', 'Administrador'),
(10, 'Paula', 'Rios', '3010001122', 'paula@correo.com', '$2a$10$hash10', 'Cliente');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`idGroomer`) REFERENCES `groomer` (`idGroomer`),
  ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`idServicio`) REFERENCES `servicio` (`idServicio`),
  ADD CONSTRAINT `reserva_ibfk_3` FOREIGN KEY (`idMascota`) REFERENCES `mascota` (`idMascota`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
