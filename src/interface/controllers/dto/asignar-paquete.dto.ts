import { IsNumber } from 'class-validator';

export class AsignarPaqueteDto {
  @IsNumber()
  id_ruta: number;

  @IsNumber()
  id_conductor: number;
}