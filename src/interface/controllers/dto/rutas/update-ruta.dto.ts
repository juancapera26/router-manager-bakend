// src/interface/controllers/dto/rutas/update-ruta.dto.ts
import {ApiProperty, PartialType} from '@nestjs/swagger';
import {IsOptional, IsDateString, IsEnum} from 'class-validator';
import {ruta_estado_ruta} from '@prisma/client';
import {CreateRutaDto} from './create-ruta.dto';

export class UpdateRutaDto extends PartialType(CreateRutaDto) {
  @ApiProperty({
    description: 'Estado de la ruta',
    enum: ruta_estado_ruta,
    example: ruta_estado_ruta.En_ruta,
    required: false
  })
  @IsOptional()
  @IsEnum(ruta_estado_ruta)
  estado_ruta?: ruta_estado_ruta;

  @ApiProperty({
    description: 'Fecha de inicio de la ruta',
    example: '2024-03-15T08:32:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiProperty({
    description: 'Fecha de fin de la ruta',
    example: '2024-03-16T18:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;
}
