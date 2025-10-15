// src/interface/controllers/dto/vehiculos/update-vehiculo.dto.ts
import { IsEnum, IsString, IsOptional, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { vehiculo_tipo } from '@prisma/client';

export class UpdateVehiculoDto {
  @IsOptional()
  @IsString({ message: 'La placa debe ser un texto' })
  @Length(6, 6, { message: 'La placa debe tener exactamente 6 caracteres' })
  @Matches(/^[A-Z]{3}[0-9]{3}$/, {
    message: 'La placa debe tener el formato ABC123 (3 letras mayúsculas y 3 números)',
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  placa?: string;

  @IsOptional()
  @IsEnum(vehiculo_tipo, {
    message: 'El tipo debe ser: camioneta, moto, furgon o camion',
  })
  tipo?: vehiculo_tipo;
}