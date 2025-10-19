import {IsString,IsNumber,IsOptional,IsDateString,IsEnum} from 'class-validator';
import {paquete_tipo_paquete} from '@prisma/client';
import { CreateClienteDto } from 'src/clientes/dto/create-cliente.dto';
export class CreatePaqueteDto {
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

  @IsOptional()
  @IsString()
  direccion_entrega?: string;

  @IsEnum(paquete_tipo_paquete)
  tipo_paquete: paquete_tipo_paquete;

  @IsOptional()
  lat?: number;

  @IsOptional()
  lng?: number;

  @IsNumber()
  valor_declarado: number;

  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsDateString()
  fecha_entrega?: Date;

  @IsOptional()
  fecha_registro?: Date;

   @IsOptional()
   @IsString()
   id_conductor?: number;
  cliente: CreateClienteDto; 
}