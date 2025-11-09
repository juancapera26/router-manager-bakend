import {IsNumber} from 'class-validator';

export class CreateUbicacionDto {
  @IsNumber()
  id_ruta: number;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
