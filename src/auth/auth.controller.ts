import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  Headers,
  UnauthorizedException
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {admin} from '../shared/firebase-admin';
import {PrismaService} from '../infrastructure/persistence/prisma/prisma.service';

export class ResetPasswordDto {
  email: string;
  newPassword: string;
}

export class ForgotPasswordDto {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Get('verify')
  @HttpCode(200)
  async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta token de autorización');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const user = await this.prisma.usuario.findUnique({
      where: {uid: decoded.uid},
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        id_rol: true,
        correo: true
      }
    });

    if (!user) {
      throw new UnauthorizedException(
        'Usuario no encontrado en la base de datos'
      );
    }

    return {
      success: true,
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: (decoded as any).role ?? user.id_rol,
      user
    };
  }

  @Post('password/forgot')
  @HttpCode(200)
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendFirebaseResetLink(dto.email);
  }

  @Post('password/reset')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }
}
