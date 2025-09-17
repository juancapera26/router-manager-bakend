/* src/interface/controllers/auth.controller.ts */
import {
  Controller,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  Req,
  Get
} from '@nestjs/common';
import {Request} from 'express';
import {FirebaseAuthProvider} from 'src/infrastructure/auth/firebase-auth.provider';
import {RegisterUserDto} from './dto/register-user.dto';
import {RegisterUserUseCase} from 'src/application/auth/use-cases/register-user.use-case';
import {admin} from 'src/shared/firebase-admin';
import {PrismaClient} from '@prisma/client';
import {MailService} from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  private prisma = new PrismaClient();

  constructor(
    private readonly firebaseAuthProvider: FirebaseAuthProvider,
    private readonly registerUser: RegisterUserUseCase,
    private readonly mailService: MailService
  ) {}

  // =============================
  // Registro de usuario
  // =============================
  @Post('register')
  async register(
    @Body() body: RegisterUserDto
  ): Promise<
    | {success: true; uid: string; token: string; role: string}
    | {success: true; uid: string; role: string}
  > {
    const {
      email,
      password,
      role,
      isPublicRegistration,
      nombre,
      apellido,
      telefono_movil,
      id_empresa,
      tipo_documento,
      documento
    } = body;

    let uid: string;
    try {
      uid = await this.firebaseAuthProvider.createUserIfNotExists(
        email,
        password,
        `${nombre} ${apellido}`
      );
      if (!uid) {
        throw new BadRequestException('Firebase no devolvió un UID válido.');
      }
    } catch (error: any) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException(
        error?.message || 'Error al crear usuario en Firebase.'
      );
    }

    try {
      await this.firebaseAuthProvider.setRole(uid, role, nombre, apellido);
      await new Promise(res => setTimeout(res, 1000));
      const actualRole = await this.firebaseAuthProvider.getRole(uid);

      await this.registerUser.execute(
        email,
        password,
        nombre,
        apellido,
        telefono_movil,
        parseInt(id_empresa),
        parseInt(role),
        tipo_documento,
        documento,
        uid
      );

      if (isPublicRegistration === true) {
        const customToken =
          await this.firebaseAuthProvider.generateCustomToken(uid);
        return {success: true, uid, role: actualRole ?? '', token: customToken};
      }

      return {success: true, uid, role: actualRole ?? ''};
    } catch (error: any) {
      console.error('[AuthController] Error en register:', error);
      throw new BadRequestException(
        error?.message || 'Error al registrar el usuario.'
      );
    }
  }

  // =============================
  // Login
  // =============================
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: {email: string; password: string}) {
    try {
      const user = await admin
        .auth()
        .getUserByEmail(body.email)
        .catch(() => null);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      // ⚠️ En Firebase Auth la validación real de contraseña se hace en el cliente (front)
      const token = await this.firebaseAuthProvider.generateCustomToken(
        user.uid
      );

      return {success: true, token, uid: user.uid, email: user.email};
    } catch (error: any) {
      throw new UnauthorizedException(error?.message || 'Error en login');
    }
  }

  // =============================
  // Forgot Password (enviar correo)
  // =============================
  @Post('forgot-password')
  async forgotPassword(@Body() body: {email: string}) {
    try {
      const link = await admin.auth().generatePasswordResetLink(body.email);

      // 🔥 Aquí deberías enviar el link por correo con tu servicio de email (SendGrid, Nodemailer, etc.)
      await this.mailService.sendPasswordResetEmail(body.email, link);

      return {success: true, message: 'Correo de recuperación enviado'};
    } catch (error: any) {
      throw new BadRequestException(
        error?.message || 'Error al enviar correo de recuperación.'
      );
    }
  }

  // =============================
  // Reset Password (cambiar contraseña)
  // =============================
  @Post('reset-password')
  async resetPassword(@Body() body: {email: string; newPassword: string}) {
    try {
      const user = await admin.auth().getUserByEmail(body.email);
      if (!user) throw new BadRequestException('Usuario no encontrado');

      await admin.auth().updateUser(user.uid, {password: body.newPassword});

      return {success: true, message: 'Contraseña actualizada correctamente'};
    } catch (error: any) {
      throw new BadRequestException(
        error?.message || 'Error al cambiar contraseña.'
      );
    }
  }

  // =============================
  // Verificar token
  // =============================
  @Get('verify')
  async verify(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return {success: false, message: 'Token no proporcionado'};

    const token = authHeader.split(' ')[1];
    try {
      const decoded = await admin.auth().verifyIdToken(token);

      const user = await this.prisma.usuario.findUnique({
        where: {correo: decoded.email}
      });
      if (!user)
        return {
          success: false,
          message: 'Usuario no encontrado en la base de datos'
        };

      return {
        success: true,
        message: 'Token válido',
        data: {correo: user.correo, role: user.id_rol}
      };
    } catch (error) {
      console.error('[AuthController] Error en verify:', error);
      return {success: false, message: 'Token inválido o expirado'};
    }
  }
}
