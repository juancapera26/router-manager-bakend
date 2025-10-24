// src/application/logistica/rutas/dto/create-ruta.dto.ts
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsString
} from 'class-validator';
import {ruta_estado_ruta} from '@prisma/client';

export class CreateRutaDto {
  @IsEnum({
    Pendiente: 'Pendiente',
    Asignada: 'Asignada',
    En_ruta: 'En_ruta',
    Completada: 'Completada',
    Fallida: 'Fallida'
  })
  estado_ruta: ruta_estado_ruta;

  @IsDateString()
  fecha_inicio: Date;

  @IsOptional()
  @IsDateString()
  fecha_fin?: Date;

  @IsOptional()
  @IsNumber()
  id_conductor?: number;

  @IsOptional()
  @IsNumber()
  id_vehiculo?: number;

  @IsOptional()
  @IsString()
  cod_manifiesto?: string;
}
