// dto/create-paquete.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { paquete_tipo_paquete } from '@prisma/client';

// ✅ DTO para el destinatario (coincide con el frontend)
class DestinatarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  direccion: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono: string;
}

// ✅ DTO para las dimensiones (coincide con el frontend)
class DimensionesDto {
  @IsNumber()
  largo: number;

  @IsNumber()
  ancho: number;

  @IsNumber()
  alto: number;

  @IsNumber()
  peso: number;
}

// ✅ DTO principal que coincide con lo que envía el frontend
export class CreatePaqueteDto {
  @ValidateNested()
  @Type(() => DestinatarioDto)
  destinatario: DestinatarioDto;

  @ValidateNested()
  @Type(() => DimensionesDto)
  dimensiones: DimensionesDto;

  @IsEnum(paquete_tipo_paquete)
  tipo_paquete: paquete_tipo_paquete;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  valor_declarado: number;

  @IsOptional()
  @IsString()
  direccion_entrega?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  id_barrio?: number;
}