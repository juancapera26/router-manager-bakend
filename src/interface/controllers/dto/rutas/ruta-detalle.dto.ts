// src/interface/controllers/dto/rutas/ruta-detalle.dto.ts
import {ApiProperty} from '@nestjs/swagger';
import {RutaResponseDto} from './ruta-response.dto';

export class ConductorDetalleDto {
  @ApiProperty({example: 1})
  id_usuario: number;

  @ApiProperty({example: 'Juan'})
  nombre: string;

  @ApiProperty({example: 'Pérez'})
  apellido: string;

  @ApiProperty({example: 'juan.perez@email.com'})
  correo: string;

  @ApiProperty({example: '3001234567'})
  telefono_movil: string;

  @ApiProperty({example: 'CC'})
  tipo_documento: string;

  @ApiProperty({example: '12345678'})
  documento: string;

  @ApiProperty({example: 'Disponible'})
  estado_conductor: string;
}

export class VehiculoDetalleDto {
  @ApiProperty({example: 1})
  id_vehiculo: number;

  @ApiProperty({example: 'ABC123'})
  placa: string;

  @ApiProperty({example: 'moto'})
  tipo: string;

  @ApiProperty({example: 'Disponible'})
  estado_vehiculo: string;
}

export class PaqueteDetalleDto {
  @ApiProperty({example: 1})
  id_paquete: number;

  @ApiProperty({example: 'PKG-2024-001'})
  codigo_rastreo: string;

  @ApiProperty({example: 'Pendiente'})
  estado_paquete: string;

  @ApiProperty({example: 'Calle 123 #45-67'})
  direccion_entrega: string;

  @ApiProperty({example: 2.5})
  peso: number;

  @ApiProperty({example: 'Grande'})
  tipo_paquete: string;

  @ApiProperty({example: 1500.0})
  valor_declarado: number;

  @ApiProperty({example: 'Chapinero'})
  barrio: string;
}

export class RutaDetalleDto extends RutaResponseDto {
  @ApiProperty({type: ConductorDetalleDto})
  declare conductor: ConductorDetalleDto;

  @ApiProperty({type: VehiculoDetalleDto})
  declare vehiculo: VehiculoDetalleDto;

  @ApiProperty({type: [PaqueteDetalleDto]})
  declare paquetes: PaqueteDetalleDto[];

  @ApiProperty({example: 12.5})
  peso_total: number;

  @ApiProperty({example: 15000.0})
  valor_total: number;
}
