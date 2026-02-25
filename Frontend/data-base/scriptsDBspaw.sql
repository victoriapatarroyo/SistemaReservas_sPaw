CREATE TABLE usuario(
    idUsuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    passwordUsuario VARCHAR(25) NOT NULL,
    rol ENUM('Cliente', 'Administrador') NOT NULL
) ENGINE=INNODB;

CREATE TABLE mascota(
    idMascota INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombreMascota VARCHAR(50),
    idUsuario INT,
    FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario)
) ENGINE=INNODB;

CREATE TABLE groomer(
    idGroomer INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    telefono VARCHAR(15),
    email VARCHAR(100)
) ENGINE=INNODB;

CREATE TABLE servicio(
	idServicio INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    precioTamPequeno DOUBLE NOT NULL,
    precioTamMediano DOUBLE NOT NULL,
    precioTamGrande DOUBLE NOT NULL
) ENGINE=INNODB;


CREATE TABLE reserva(
    idReserva INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idGroomer INT NOT NULL,
    idServicio INT NOT NULL,
    idMascota INT NOT NULL, 
    fecha DATE NOT NULL,
    horaInicio TIME NOT NULL,
    horaFinal TIME NOT NULL,
    FOREIGN KEY(idGroomer) REFERENCES groomer(idGroomer),
    FOREIGN KEY(idServicio) REFERENCES servicio(idServicio),
    FOREIGN KEY(idMascota) REFERENCES mascota(idMascota)
) ENGINE=INNODB;
