// src/interface/controllers/dto/rutas/create-ruta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, IsOptional, IsEnum, Length, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ruta_estado_ruta } from '@prisma/client';

export class CreateRutaDto {
  @ApiProperty({
    description: 'Estado inicial de la ruta',
    enum: ruta_estado_ruta,
    default: ruta_estado_ruta.Pendiente,
    example: ruta_estado_ruta.Pendiente
  })
  @IsOptional()
  @IsEnum(ruta_estado_ruta)
  estado_ruta?: ruta_estado_ruta = ruta_estado_ruta.Pendiente;

  @ApiProperty({
    description: 'Fecha de inicio de la ruta',
    example: '2024-03-15T08:32:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDateString()
  fecha_inicio: string;

  @ApiProperty({
    description: 'Fecha de fin de la ruta (opcional)',
    example: '2024-03-16T18:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @ApiProperty({
    description: 'ID del conductor asignado',
    example: 1,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id_conductor?: number;

  @ApiProperty({
    description: 'ID del vehículo asignado',
    example: 1,
    minimum: 1,
    required: false
  })

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id_vehiculo?: number;
}