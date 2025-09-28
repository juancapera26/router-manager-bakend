// src/interface/controllers/dto/rutas/asignar-paquetes.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min, ArrayMinSize } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AsignarPaquetesDto {
  @ApiProperty({
    description: 'Array de IDs de paquetes a asignar a la ruta',
    example: [1, 2, 3, 4],
    type: [Number],
    minItems: 1
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe asignar al menos un paquete' })
  @IsInt({ each: true, message: 'Cada ID de paquete debe ser un número entero' })
  @Min(1, { each: true, message: 'Cada ID de paquete debe ser mayor a 0' })
  @Type(() => Number)
  @Transform(({ value }) => Array.isArray(value) ? value.map(id => parseInt(id)) : [parseInt(value)])
  id_paquetes: number[];
}