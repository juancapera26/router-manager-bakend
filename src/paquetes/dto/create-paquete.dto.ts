//create-paquete.dto.ts
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { paquete_estado_paquete, paquete_tipo_paquete } from '@prisma/client';

export class CreatePaqueteDto {
  @IsOptional()
  @IsDateString()
  fecha_entrega?: Date;

  @IsOptional()
  @IsEnum(paquete_estado_paquete)
  estado_paquete?: paquete_estado_paquete;

  @IsOptional()
  @IsString()
  codigo_rastreo?: string;

  @IsOptional()
  @IsString()
  estado_entrega?: string;

  @IsNumber()
  largo: number;

  @IsNumber()
  ancho: number;

  @IsNumber()
  alto: number;

  @IsNumber()
  peso: number;

  @IsNumber()
  id_cliente: number;

  @IsOptional()
  @IsNumber()
  id_ruta?: number;

  @IsOptional()
  @IsNumber()
  id_barrio?: number;

  @IsDateString()
  fecha_recibido: Date;

  @IsString()
  direccion: string;

  @IsEnum(paquete_tipo_paquete)
  tipo_paquete: paquete_tipo_paquete;
}
