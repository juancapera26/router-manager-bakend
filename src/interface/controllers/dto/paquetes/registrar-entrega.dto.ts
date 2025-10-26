import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {paquete_estado_paquete} from '@prisma/client';

export class RegistrarEntregaDto {
  @IsEnum(paquete_estado_paquete)
  @IsNotEmpty()
  estado_paquete: paquete_estado_paquete; // 'Entregado' o 'Fallido'

  @IsOptional()
  @IsString()
  observacion_entrega?: string;
}
