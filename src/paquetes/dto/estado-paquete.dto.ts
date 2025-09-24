import { IsEnum } from 'class-validator';
import { paquete_estado_paquete } from '@prisma/client';

export class EstadoPaqueteDto {
  @IsEnum(paquete_estado_paquete)
  estado: paquete_estado_paquete;
}