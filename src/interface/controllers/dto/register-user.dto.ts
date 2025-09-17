// src/application/auth/dto/register-user.dto.ts
import {IsEmail,IsString,MinLength,IsOptional,IsBoolean,IsNumberString} from 'class-validator';
export class RegisterUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsBoolean()
  isPublicRegistration?: boolean = false;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsNumberString()
  telefono_movil: string;

  @IsNumberString()
  id_empresa: string;

  @IsString()
  tipo_documento: string;

  @IsString()
  documento: string;
}
