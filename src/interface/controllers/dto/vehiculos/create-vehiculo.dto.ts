// src/interface/controllers/dto/vehiculos/create-vehiculo.dto.ts
import { IsEnum, IsString, IsOptional, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { vehiculo_tipo, vehiculo_estado_vehiculo } from '@prisma/client';

export class CreateVehiculoDto {
  @IsString({ message: 'La placa debe ser un texto' })
  @Length(6, 6, { message: 'La placa debe tener exactamente 6 caracteres' })
  @Matches(/^[A-Z]{3}[0-9]{3}$/, {
    message: 'La placa debe tener el formato ABC123 (3 letras mayúsculas y 3 números)',
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  placa: string;

  @IsEnum(vehiculo_tipo, {
    message: 'El tipo debe ser: camioneta, moto, furgon o camion',
  })
  tipo: vehiculo_tipo;

  @IsOptional()
  @IsEnum(vehiculo_estado_vehiculo, {
    message: 'El estado debe ser: Disponible o No disponible',
  })
  estado_vehiculo?: vehiculo_estado_vehiculo;
}