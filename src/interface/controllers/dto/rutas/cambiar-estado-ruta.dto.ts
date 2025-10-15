// src/interface/controllers/dto/rutas/cambiar-estado-ruta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ruta_estado_ruta } from '@prisma/client';

export class CambiarEstadoRutaDto {
  @ApiProperty({
    description: 'Nuevo estado de la ruta',
    enum: ruta_estado_ruta,
    example: ruta_estado_ruta.En_ruta
  })
  @IsEnum(ruta_estado_ruta)
  estado_ruta: ruta_estado_ruta;
}
