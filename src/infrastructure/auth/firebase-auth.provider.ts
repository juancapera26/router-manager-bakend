// infrastructure/auth/firebase-auth.provider.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger
} from '@nestjs/common';
import {AuthProvider} from '../../domain/auth/auth.provider';
import {admin} from '../../shared/firebase-admin';

@Injectable()
export class FirebaseAuthProvider implements AuthProvider {
  private readonly logger = new Logger(FirebaseAuthProvider.name);

  async createUser(
    email: string,
    password: string,
    displayName?: string
  ): Promise<string> {
    const user = await admin.auth().createUser({email, password, displayName});
    return user.uid;
  }

  async setRole(
    uid: string,
    role: string,
    nombre?: string,
    apellido?: string
  ): Promise<void> {
    try {
      const claims = {role};

      if (nombre) claims['nombre'] = nombre;
      if (apellido) claims['apellido'] = apellido;

      this.logger.log(
        `[setRole] UID: ${uid}, Claims: ${JSON.stringify(claims)}`
      );
      await admin.auth().setCustomUserClaims(uid, claims);
      this.logger.log(`[setRole] Claims asignados correctamente`);
    } catch (error: any) {
      this.logger.error('[setRole] 🔥 Error al asignar claims:', error);
      throw new Error(`[setRole] Firebase error: ${error.message}`);
    }
  }

  async createUserIfNotExists(
    email: string,
    password: string,
    displayName?: string
  ): Promise<string> {
    try {
      await admin.auth().getUserByEmail(email);
      throw new ConflictException('El correo ya está registrado.');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        const user = await admin
          .auth()
          .createUser({email, password, displayName});
        return user.uid;
      }
      if (error instanceof ConflictException) throw error;

      throw new BadRequestException(
        error.message || 'Error al crear usuario en Firebase.'
      );
    }
  }

  async getRole(uid: string): Promise<string | null> {
    const user = await admin.auth().getUser(uid);
    return (user.customClaims?.role as string) ?? null;
  }

  async generateCustomToken(uid: string): Promise<string> {
    return await admin.auth().createCustomToken(uid);
  }

  // 👇 NUEVO: eliminar usuario en Firebase
  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      this.logger.log(`✅ Usuario Firebase eliminado correctamente: ${uid}`);
    } catch (error) {
      this.logger.error(
        `❌ Error al eliminar usuario Firebase (${uid}):`,
        error
      );
      throw new BadRequestException('Error al eliminar usuario en Firebase.');
    }
  }
}
