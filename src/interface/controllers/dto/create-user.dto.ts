import {IsEmail, IsNumber, IsString} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  correo: string;
  @IsString()
  contrasena: string;
  @IsString()
  nombre: string;
  @IsString()
  apellido: string;
  @IsString()
  telefono_movil: string;
  @IsNumber()
  id_empresa: number;
  @IsNumber()
  id_rol: number;
  @IsString()
  tipo_documento: string;
  @IsString()
  documento: string;
  @IsString()
  uid: string;
}
