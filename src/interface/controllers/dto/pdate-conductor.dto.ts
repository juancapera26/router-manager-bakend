import {IsEmail, IsOptional, IsString, IsUrl} from 'class-validator';

export class UpdateConductorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsUrl() // Si esperas que la foto sea una URL
  foto_perfil?: string;
}
