// src/application/logistica/rutas/dto/cambiar-estado-ruta.dto.ts
import {IsEnum} from 'class-validator';
import {ruta_estado_ruta} from '@prisma/client';

export class CambiarEstadoRutaDto {
  @IsEnum(ruta_estado_ruta)
  nuevoEstado: ruta_estado_ruta;
}
