-- Schema para db_ventas: crea la base, tablas y datos semilla de forma idempotente

CREATE DATABASE IF NOT EXISTS db_ventas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_ventas;

-- Tabla tipo_usuario
CREATE TABLE IF NOT EXISTS tipo_usuario (
  id_tipo_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tablas base del anexo (si no existen)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  documento_identidad VARCHAR(20) UNIQUE NOT NULL,
  direccion VARCHAR(150),
  telefono VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos semilla: tipo_usuario (idempotente)
INSERT INTO tipo_usuario (id_tipo_usuario, nombre, descripcion) VALUES
(1, 'Ciudadano', 'Usuario que realiza las denuncias (RF-01).'),
(2, 'Autoridad_Municipal', 'Usuario con rol de gestión y resolución (RF-02).'),
(3, 'Administrador', 'Usuario de gestión de plataforma y maestros.')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion);

-- Otros seeds opcionales (puedes descomentar si los necesitas)
-- INSERT INTO productos (nombre, precio, stock) VALUES ('Ejemplo', 100.00, 10) ON DUPLICATE KEY UPDATE precio=VALUES(precio), stock=VALUES(stock);
