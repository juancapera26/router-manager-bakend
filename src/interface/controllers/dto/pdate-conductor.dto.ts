import {IsOptional, IsString, IsUrl} from 'class-validator';

export class UpdateConductorDto {
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsUrl() // Si esperas que la foto sea una URL
  foto_perfil?: string;
}
