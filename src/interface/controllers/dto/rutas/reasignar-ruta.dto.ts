// src/interface/controllers/dto/rutas/reasignar-ruta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReasignarRutaDto {
  @ApiProperty({
    description: 'Nuevo ID del conductor a asignar',
    example: 2,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id_conductor?: number;

  @ApiProperty({
    description: 'Nuevo ID del vehículo a asignar',
    example: 2,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id_vehiculo?: number;
}
