import { IsNumber, IsOptional, IsString } from 'class-validator';
// dto/asignar-paquete.dto.ts1

export class AsignarPaqueteDto {
  @IsNumber()
  id_ruta: number;

  @IsString()
  cod_manifiesto?: string; // ← NUEVO

  @IsNumber()
  @IsOptional()
  id_conductor?: number;
}