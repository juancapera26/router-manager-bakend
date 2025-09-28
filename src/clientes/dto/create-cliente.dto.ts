import { IsString, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  direccion: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono_movil: string;
}
