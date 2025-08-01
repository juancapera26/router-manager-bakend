// infrastructure/auth/firebase-auth.provider.ts
import {
  BadRequestException,
  ConflictException,
  Injectable
} from '@nestjs/common';
import {AuthProvider} from '../../domain/auth/auth.provider';
import {admin} from '../../shared/firebase-admin';

@Injectable()
export class FirebaseAuthProvider implements AuthProvider {
  async createUser(email: string, password: string): Promise<string> {
    const user = await admin.auth().createUser({email, password});
    return user.uid;
  }

  async setRole(uid: string, role: string): Promise<void> {
    try {
      console.log(`[setRole] UID: ${uid}, Role: ${role}`);
      await admin.auth().setCustomUserClaims(uid, {role});
      console.log(`[setRole] Rol asignado correctamente`);
    } catch (error: any) {
      console.error('[setRole] 🔥 Error al asignar custom claim:', error);
      throw new Error(
        `[setRole] Firebase error: ${error.message || error.toString()}`
      );
    }
  }
  async createUserIfNotExists(
    email: string,
    password: string
  ): Promise<string> {
    try {
      // Verificar si ya existe
      await admin.auth().getUserByEmail(email);
      // Si llega aquí, el usuario existe
      throw new ConflictException('El correo ya está registrado.');
    } catch (error: any) {
      // Si no existe, getUserByEmail lanza auth/user-not-found
      if (error.code === 'auth/user-not-found') {
        // Crear usuario
        const user = await admin.auth().createUser({email, password});
        return user.uid;
      }
      // Si es algún otro error
      if (error instanceof ConflictException) {
        throw error;
      }
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
}
