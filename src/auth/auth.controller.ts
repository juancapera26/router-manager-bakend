// auth.controller.ts
import {Body, Controller, Post, HttpCode} from '@nestjs/common';
import {AuthService} from './auth.service';

export class ResetPasswordDto {
  email: string;
  newPassword: string;
}

export class ForgotPasswordDto {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Enviar link de recuperación
  @Post('password/forgot')
  @HttpCode(200)
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendFirebaseResetLink(dto.email);
  }

  // Reset de contraseña
  @Post('password/reset')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }
}
