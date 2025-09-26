// src/interface/controllers/dto/create-novedad.dto.ts
import {IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {novedades_tipo} from '@prisma/client'; // 👈 Prisma genera este enum

export class CreateNovedadDto {
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(novedades_tipo)
  tipo: novedades_tipo; // 👈 usa el enum de Prisma

  @IsOptional()
  imagen?: string; // ruta o nombre del archivo guardado
}
