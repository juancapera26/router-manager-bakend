import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum
} from 'class-validator';
import {ruta_estado_ruta} from '@prisma/client';

export class CreateRutaDto {
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string | null;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string | null; // Permitir null

  @IsOptional()
  @IsEnum(ruta_estado_ruta)
  ruta_estado?: ruta_estado_ruta;

  @IsNumber()
  id_conductor: number;

  @IsNumber()
  id_vehiculo: number;

  @IsOptional()
  @IsString()
  cod_manifiesto?: string;
}
