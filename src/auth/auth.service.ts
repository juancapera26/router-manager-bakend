// auth.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private prisma = new PrismaClient();

  constructor(private mail: MailService, private config: ConfigService) {
    const serviceAccountPath = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

    if (!admin.apps.length) {
const serviceAccountPath = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
if (!serviceAccountPath) throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH no definido en .env');
const serviceAccount = JSON.parse(readFileSync(join(process.cwd(), serviceAccountPath), 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: this.config.get<string>('FIREBASE_DATABASE_URL'),
      });
    }
  }

  // 🔹 Enviar link de recuperación
  async sendFirebaseResetLink(email: string) {
    try {
      await admin.auth().getUserByEmail(email);
      const resetLink = await admin.auth().generatePasswordResetLink(email, {
        url: `${this.config.get<string>('FRONTEND_URL')}/auth/password/reset`,
      });
      await this.mail.sendPasswordResetEmail(email, resetLink);
      return { message: 'Email de recuperación enviado' };
    } catch (error) {
      this.logger.error('Error enviando reset link:', error);
      throw new BadRequestException('Error al enviar email de recuperación');
    }
  }

  // 🔹 Reset de contraseña (Firebase + Prisma)
  async resetPassword(email: string, newPassword: string) {
    if (!email || !newPassword)
      throw new BadRequestException('Email y contraseña son requeridos');
    if (newPassword.length < 6)
      throw new BadRequestException('Contraseña mínimo 6 caracteres');

    try {
      // 🔹 Firebase
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, { password: newPassword });
      await admin.auth().revokeRefreshTokens(user.uid);

      // 🔹 Prisma (SQL)
      const usuario = await this.prisma.usuario.findUnique({
        where: { correo: email }, // buscar por correo
      });
      if (!usuario) throw new BadRequestException('Usuario no encontrado en SQL');

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.usuario.update({
        where: { id_usuario: usuario.id_usuario }, // usar el id_usuario real
        data: { contrasena: hashedPassword },
      });

      return { message: 'Contraseña actualizada exitosamente', email, uid: user.uid };
    } catch (error) {
      this.logger.error('Error actualizando contraseña:', error);
      throw new BadRequestException('No se pudo actualizar la contraseña');
    }
  }
}
