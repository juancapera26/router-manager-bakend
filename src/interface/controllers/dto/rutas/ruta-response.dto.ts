// src/interface/controllers/dto/rutas/ruta-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ruta_estado_ruta } from '@prisma/client';

export class ConductorBasicDto {
  @ApiProperty({ example: 1 })
  id_usuario: number;

  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  correo: string;

  @ApiProperty({ example: '3001234567' })
  telefono_movil: string;
}

export class VehiculoBasicDto {
  @ApiProperty({ example: 1 })
  id_vehiculo: number;

  @ApiProperty({ example: 'ABC123' })
  placa: string;

  @ApiProperty({ example: 'moto' })
  tipo: string;
}

export class PaqueteBasicDto {
  @ApiProperty({ example: 1 })
  id_paquete: number;

  @ApiProperty({ example: 'PKG-2024-001' })
  codigo_rastreo: string;

  @ApiProperty({ example: 'Pendiente' })
  estado_paquete: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  direccion_entrega: string;
}

export class RutaResponseDto {
  @ApiProperty({ example: 1 })
  id_ruta: number;

  @ApiProperty({ enum: ruta_estado_ruta, example: ruta_estado_ruta.Pendiente })
  estado_ruta: ruta_estado_ruta;

  @ApiProperty({ example: '2024-03-15T08:32:00Z', type: 'string', format:'date-time' })
  fecha_inicio: string;

  @ApiProperty({ example: '2024-03-16T18:00:00Z', type: 'string', format: 'date-time', nullable: true })
  fecha_fin: string | null;

  @ApiProperty({ example: 'MAN-2024-001' })
  cod_manifiesto: string;

  @ApiProperty({ type: ConductorBasicDto })
  conductor: ConductorBasicDto;

  @ApiProperty({ type: VehiculoBasicDto })
  vehiculo: VehiculoBasicDto;

  @ApiProperty({ type: [PaqueteBasicDto] })
  paquetes: PaqueteBasicDto[];

  @ApiProperty({ example: 5 })
  total_paquetes: number;

  @ApiProperty({ example: '2024-03-15T10:30:00Z' })
  fecha_creacion: string;
}