// infrastructure/auth/firebase-auth.provider.ts
import { Injectable } from '@nestjs/common';
import { AuthProvider } from '../../domain/auth/auth.provider';
import { admin } from '../../shared/firebase-admin';

@Injectable()
export class FirebaseAuthProvider implements AuthProvider {
  async createUser(email: string, password: string): Promise<string> {
    const user = await admin.auth().createUser({ email, password });
    return user.uid;
  }

  async setRole(uid: string, role: string): Promise<void> {
    await admin.auth().setCustomUserClaims(uid, { role });
  }

  async getRole(uid: string): Promise<string | null> {
    const user = await admin.auth().getUser(uid);
    return (user.customClaims?.role as string) ?? null;
  }

  async generateCustomToken(uid: string): Promise<string> {
    return await admin.auth().createCustomToken(uid);
  }
}
