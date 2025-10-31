import { IsNumber, IsOptional } from 'class-validator';

export class AsignarPaqueteDto {
  @IsNumber()
  id_ruta: number;

  @IsNumber()
  @IsOptional()
  id_conductor?: number;
}