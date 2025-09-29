// src/interface/controllers/dto/rutas/asignar-vehiculo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class AsignarVehiculoDto {
  @ApiProperty({
    description: 'ID del vehículo a asignar',
    example: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  id_vehiculo: number;
}