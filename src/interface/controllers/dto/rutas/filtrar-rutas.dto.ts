// src/interface/controllers/dto/rutas/filtrar-rutas.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, IsDateString, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ruta_estado_ruta } from '@prisma/client';

export class FiltrarRutasDto {
  @ApiProperty({
    description: 'Estado de las rutas a filtrar',
    enum: ruta_estado_ruta,
    example: ruta_estado_ruta.Pendiente,
    required: false
  })
  @IsOptional()
  @IsEnum(ruta_estado_ruta)
  estado_ruta?: ruta_estado_ruta;

  @ApiProperty({
    description: 'ID del conductor para filtrar',
    example: 1,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id_conductor?: number;

  @ApiProperty({
    description: 'ID del vehículo para filtrar',
    example: 1,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id_vehiculo?: number;

  @ApiProperty({
    description: 'Fecha de inicio desde (YYYY-MM-DD)',
    example: '2024-03-01T08:32:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @ApiProperty({
    description: 'Fecha de inicio hasta (YYYY-MM-DD)',
    example: '2024-03-16T22:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;

  @ApiProperty({
    description: 'Código de manifiesto para buscar',
    example: 'MAN-2024',
    required: false
  })
  @IsOptional()
  @IsString()
  cod_manifiesto?: string;

  @ApiProperty({
    description: 'Página para paginación',
    example: 1,
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Límite de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}