import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { join } from 'path';

// ------------------ DTOs ------------------

// Login
export class LoginDto {
  email: string;
  password: string;
}

// Registro completo
export class RegisterDto {
  email: string;
  password: string;
  role: string;
  isPublicRegistration: boolean;
  nombre: string;
  apellido: string;
  telefono_movil: string;
  id_empresa: string;
  tipo_documento: string;
  documento: string;
}

// Reset de contraseña
export class ResetPasswordDto {
  email: string;
  newPassword: string;
  token?: string;
}

// Verificación de email
export class VerifyEmailDto {
  email: string;
  token?: string;
  code?: string;
}

// DTO para envío de link de recuperación
export class ForgotPasswordDto {
  email: string;
}

// ------------------ Controller ------------------

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Registro
  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Verificación de email manual
  @Post('email/verify-manual')
  @HttpCode(200)
  async verifyEmailManual(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailManual(dto);
  }

  // Enviar link de recuperación de contraseña
  @Post('password/forgot')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60 } })
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendFirebaseResetLink(dto.email);
  }

  // Servir página HTML de reset de contraseña
  @Get('password/reset')
  async resetPasswordView(
    @Query('email') email: string,
    @Query('token') token: string,
    @Res() res: Response
  ) {
    res.sendFile(join(process.cwd(), 'src/auth/views/reset-password.html'));
  }

  // Alias opcional para el mismo HTML
  @Get('reset-password')
  async resetPasswordShortcut(
    @Query('email') email: string,
    @Query('token') token: string,
    @Res() res: Response
  ) {
    res.sendFile(join(process.cwd(), 'src/auth/views/reset-password.html'));
  }

  // Reset de contraseña (POST)
  @Post('password/reset')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.newPassword, dto.token);
  }
}
