-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NOT NULL,
    `apellido` VARCHAR(30) NOT NULL,
    `direccion` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(50) NOT NULL,
    `telefono_movil` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa` (
    `id_empresa` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nit` VARCHAR(30) NOT NULL,
    `nombre_empresa` VARCHAR(50) NOT NULL,
    `telefono_empresa` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id_empresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paquete` (
    `id_paquete` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo_rastreo` VARCHAR(50) NULL,
    `fecha_registro` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_entrega` DATE NULL,
    `estado_paquete` ENUM('Pendiente', 'Asignado', 'En ruta', 'Entregado', 'Fallido') NOT NULL DEFAULT 'Pendiente',
    `largo` FLOAT NOT NULL,
    `ancho` FLOAT NOT NULL,
    `alto` FLOAT NOT NULL,
    `peso` FLOAT NOT NULL,
    `id_cliente` INTEGER UNSIGNED NOT NULL,
    `id_ruta` INTEGER UNSIGNED NULL,
    `id_barrio` INTEGER UNSIGNED NULL,
    `direccion_entrega` VARCHAR(100) NULL,
    `tipo_paquete` ENUM('Grande', 'Mediano', 'Pequeno', 'Refrigerado', 'Fragil') NOT NULL,
    `lat` DECIMAL(10, 8) NULL,
    `lng` DECIMAL(11, 8) NULL,
    `valor_declarado` FLOAT NOT NULL,
    `cantidad` INTEGER NOT NULL,

    UNIQUE INDEX `codigo_rastreo`(`codigo_rastreo`),
    INDEX `idx_paquete_id_cliente`(`id_cliente`),
    INDEX `idx_paquete_id_barrio`(`id_barrio`),
    INDEX `idx_paquete_id_ruta`(`id_ruta`),
    INDEX `idx_paquete_estado`(`estado_paquete`),
    PRIMARY KEY (`id_paquete`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ruta` (
    `id_ruta` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `estado_ruta` ENUM('Pendiente', 'Asignada', 'En ruta', 'Completada', 'Fallida') NOT NULL DEFAULT 'Pendiente',
    `fecha_inicio` DATE NOT NULL,
    `fecha_fin` DATE NULL,
    `id_conductor` INTEGER UNSIGNED NOT NULL,
    `id_vehiculo` INTEGER UNSIGNED NOT NULL,
    `cod_manifiesto` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `cod_manifiesto`(`cod_manifiesto`),
    INDEX `idx_ruta_id_conductor`(`id_conductor`),
    INDEX `idx_ruta_id_vehiculo`(`id_vehiculo`),
    INDEX `idx_ruta_estado`(`estado_ruta`),
    PRIMARY KEY (`id_ruta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(255) NOT NULL,
    `contrasena` VARCHAR(100) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `id_empresa` INTEGER UNSIGNED NOT NULL,
    `telefono_movil` VARCHAR(30) NULL,
    `id_rol` INTEGER UNSIGNED NOT NULL,
    `tipo_documento` VARCHAR(30) NULL,
    `documento` VARCHAR(30) NULL,
    `uid` VARCHAR(50) NOT NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `fecha_registro` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_correo`(`correo`),
    UNIQUE INDEX `uq_uid`(`uid`),
    INDEX `idx_usuario_id_empresa`(`id_empresa`),
    INDEX `idx_usuario_id_rol`(`id_rol`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehiculo` (
    `id_vehiculo` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `placa` VARCHAR(30) NOT NULL,
    `tipo` ENUM('camioneta', 'moto', 'furgon', 'camion') NOT NULL DEFAULT 'moto',
    `estado_vehiculo` ENUM('Disponible', 'No disponible') NOT NULL DEFAULT 'Disponible',

    PRIMARY KEY (`id_vehiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barrio` (
    `id_barrio` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_barrio` VARCHAR(30) NOT NULL,
    `id_localidad` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_barrio_id_localidad`(`id_localidad`),
    PRIMARY KEY (`id_barrio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localidad` (
    `id_localidad` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_localidad` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id_localidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `novedades` (
    `id_novedad` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,
    `tipo` ENUM('Logística', 'Operativa') NOT NULL,
    `fecha` DATE NOT NULL,
    `id_usuario` INTEGER UNSIGNED NOT NULL,
    `imagen` VARCHAR(255) NULL,

    INDEX `idx_novedades_id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_novedad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_conductor` (
    `id_conductor` INTEGER UNSIGNED NOT NULL,
    `estado` ENUM('Disponible', 'En ruta', 'No disponible') NOT NULL DEFAULT 'Disponible',

    INDEX `idx_estado_conductor_estado`(`estado`),
    PRIMARY KEY (`id_conductor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `paquete` ADD CONSTRAINT `paquete_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paquete` ADD CONSTRAINT `paquete_ibfk_2` FOREIGN KEY (`id_ruta`) REFERENCES `ruta`(`id_ruta`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `paquete` ADD CONSTRAINT `paquete_ibfk_3` FOREIGN KEY (`id_barrio`) REFERENCES `barrio`(`id_barrio`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ruta` ADD CONSTRAINT `ruta_ibfk_1` FOREIGN KEY (`id_conductor`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ruta` ADD CONSTRAINT `ruta_ibfk_2` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo`(`id_vehiculo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa`(`id_empresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barrio` ADD CONSTRAINT `barrio_ibfk_1` FOREIGN KEY (`id_localidad`) REFERENCES `localidad`(`id_localidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `novedades` ADD CONSTRAINT `novedad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estado_conductor` ADD CONSTRAINT `fk_estado_conductor_id_conductor` FOREIGN KEY (`id_conductor`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
