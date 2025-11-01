import { IsNumber, IsOptional } from 'class-validator';
// dto/asignar-paquete.dto.ts1

export class AsignarPaqueteDto {
  @IsNumber()
  id_ruta: number;

  @IsNumber()
  @IsOptional()
  id_conductor?: number;
}