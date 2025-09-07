/* src/interface/controllers/auth.controller.ts */
import {
  Controller,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  Req,
  Get
} from '@nestjs/common';
import {Request} from 'express';
import {FirebaseAuthProvider} from 'src/infrastructure/auth/firebase-auth.provider';
import {RegisterUserDto} from './dto/register-user.dto';
import {RegisterUserUseCase} from 'src/application/auth/use-cases/register-user.use-case';
import {admin} from 'src/shared/firebase-admin'; // 👈 tu instancia firebase-admin
import {PrismaClient} from '@prisma/client'; // 👈 o tu servicio UsersService

@Controller('auth')
export class AuthController {
  private prisma = new PrismaClient(); // ⚠️ mejor inyectar UsersService en producción

  constructor(
    private readonly firebaseAuthProvider: FirebaseAuthProvider,
    private readonly registerUser: RegisterUserUseCase
  ) {}

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
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        error?.message || 'Error al crear usuario en Firebase.'
      );
    }

    try {
      await this.firebaseAuthProvider.setRole(uid, role, nombre, apellido);
      await new Promise(res => setTimeout(res, 1000));

      const actualRole = await this.firebaseAuthProvider.getRole(uid);
      if (!actualRole || actualRole !== String(role)) {
        console.warn(
          `⚠️ Rol asignado con posible error o discrepancia. Esperado: ${role}, Obtenido: ${actualRole}`
        );
      }

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
        return {
          success: true,
          uid,
          role: actualRole ?? '',
          token: customToken
        };
      }

      return {success: true, uid, role: actualRole ?? ''};
    } catch (error: any) {
      console.error('[AuthController] Error en register:', error);
      throw new BadRequestException(
        error?.message || 'Error al registrar el usuario.'
      );
    }
  }

  // 👇 Nuevo endpoint para validar el JWT y revisar si existe en la BD
  @Get('verify')
  async verify(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return {
        success: false,
        message: 'Token no proporcionado'
      };
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"

    try {
      // ✅ Validar token con Firebase
      const decoded = await admin.auth().verifyIdToken(token);

      console.log('[AuthController] decoded token:', decoded);

      // ✅ Buscar usuario en BD por correo
      const user = await this.prisma.usuario.findUnique({
        where: {correo: decoded.email}
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado en la base de datos'
        };
      }

      return {
        success: true,
        message: 'Token válido',
        data: {
          correo: user.correo,
          role: user.id_rol
        }
      };
    } catch (error) {
      console.error('[AuthController] Error en verify:', error);
      return {
        success: false,
        message: 'Token inválido o expirado'
      };
    }
  }
}
