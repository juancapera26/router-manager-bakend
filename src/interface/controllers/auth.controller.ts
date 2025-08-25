/* src/interface/controllers/auth.controller.ts */
import {
  Controller,
  Post,
  Body,
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import {FirebaseAuthProvider} from 'src/infrastructure/auth/firebase-auth.provider';
import {RegisterUserDto} from './dto/register-user.dto';
import {RegisterUserUseCase} from 'src/application/auth/use-cases/register-user.use-case';

@Controller('auth')
export class AuthController {
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

      // ✅ Validación inmediata para evitar null/undefined
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
      // Asignar rol en Firebase
      await this.firebaseAuthProvider.setRole(uid, role);

      // Esperar propagación de customClaims
      await new Promise(res => setTimeout(res, 1000));

      const actualRole = await this.firebaseAuthProvider.getRole(uid);
      if (!actualRole || actualRole !== String(role)) {
        console.warn(
          `⚠️ Rol asignado con posible error o discrepancia. Esperado: ${role}, Obtenido: ${actualRole}`
        );
      }

      // Lógica de dominio: registro en tu base de datos
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

      // Si es un registro público → devolver también customToken
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
}
