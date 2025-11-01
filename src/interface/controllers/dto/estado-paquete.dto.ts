import { IsEnum } from 'class-validator';
import { paquete_estado_paquete } from '@prisma/client';

// dto/estado-paquete.dto.ts

export class EstadoPaqueteDto {
  @IsEnum(paquete_estado_paquete)
  estado: paquete_estado_paquete;
}