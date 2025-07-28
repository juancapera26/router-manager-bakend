// src/application/auth/dto/register-user.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

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
}
