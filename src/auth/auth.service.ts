import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MailService } from '../mail/mail.service';
import { LoginDto, RegisterDto, VerifyEmailDto } from './auth.controller';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private mail: MailService, private config: ConfigService) {
    // Validar ruta al service account
    const serviceAccountPath = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    if (!serviceAccountPath) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH no definido en .env');
    }

    // Inicializar Admin SDK solo si no está inicializado
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        readFileSync(join(process.cwd(), serviceAccountPath), 'utf-8')
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: this.config.get<string>('FIREBASE_DATABASE_URL'),
      });
    }
  }

  private get firebase(): admin.app.App {
    return admin.app();
  }

  // 🔑 Login usando Firebase Client SDK
  async login(dto: LoginDto) {
    try {
      this.logger.log(`🔐 Intentando login para: ${dto.email}`);

      const firebaseConfig = {
        apiKey: this.config.get<string>('FIREBASE_API_KEY'),
        authDomain: this.config.get<string>('FIREBASE_AUTH_DOMAIN'),
        projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
        storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: this.config.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
        appId: this.config.get<string>('FIREBASE_APP_ID'),
      };

      const existingApps = getApps();
      const clientApp =
        existingApps.find(app => app.name === 'client-auth') ||
        initializeApp(firebaseConfig, 'client-auth');

      const clientAuth = getAuth(clientApp);

      try {
        await signInWithEmailAndPassword(clientAuth, dto.email, dto.password);
        this.logger.log(`✅ Contraseña validada para: ${dto.email}`);
      } catch {
        this.logger.warn(`❌ Credenciales inválidas para: ${dto.email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const userRecord = await this.firebase.auth().getUserByEmail(dto.email);
      const customToken = await this.firebase.auth().createCustomToken(userRecord.uid);

      let userData = {};
      try {
        const userDoc = await this.firebase.firestore().collection('users').doc(userRecord.uid).get();
        if (userDoc.exists) userData = userDoc.data() || {};
      } catch (_) {}

      return {
        message: 'Login exitoso',
        token: customToken,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
          ...userData,
        },
      };
    } catch (error) {
      this.logger.error('Error en login:', error);
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // 🔹 Registro completo
  async register(dto: RegisterDto) {
    try {
      const userRecord = await this.firebase.auth().createUser({
        email: dto.email,
        password: dto.password,
        displayName: `${dto.nombre} ${dto.apellido}`,
        emailVerified: false,
      });

      await this.firebase.firestore().collection('users').doc(userRecord.uid).set({
        role: dto.role,
        isPublicRegistration: dto.isPublicRegistration,
        nombre: dto.nombre,
        apellido: dto.apellido,
        telefono_movil: dto.telefono_movil,
        id_empresa: dto.id_empresa,
        tipo_documento: dto.tipo_documento,
        documento: dto.documento,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        message: 'Usuario registrado exitosamente',
        user: { email: dto.email, firebaseUid: userRecord.uid },
      };
    } catch (error) {
      this.logger.error('Error en registro:', error);
      throw new BadRequestException('Error al registrar usuario: ' + error.message);
    }
  }

  // 🔹 Verificación de email manual
  async verifyEmailManual(dto: VerifyEmailDto) {
    if (!dto.email) throw new BadRequestException('Email obligatorio');
    try {
      const user = await this.firebase.auth().getUserByEmail(dto.email);
      if (user.emailVerified) return { message: 'Correo ya verificado', email: user.email };
      await this.firebase.auth().updateUser(user.uid, { emailVerified: true });
      return { message: 'Correo verificado manualmente', email: user.email };
    } catch (error) {
      this.logger.error('Error verificando email:', error);
      throw new BadRequestException('No se pudo verificar el correo');
    }
  }

  // 🔹 Enviar link de recuperación
  async sendFirebaseResetLink(email: string) {
    try {
      await this.firebase.auth().getUserByEmail(email);
      const resetLink = await this.firebase.auth().generatePasswordResetLink(email, {
        url: `${this.config.get<string>('FRONTEND_URL')}/auth/password/reset`,
      });
      await this.mail.sendPasswordResetEmail(email, resetLink);
      return { message: 'Email de recuperación enviado' };
    } catch (error) {
      this.logger.error('Error enviando reset link:', error);
      throw new BadRequestException('Error al enviar email de recuperación');
    }
  }

  // 🔹 Reset de contraseña
  async resetPassword(email: string, newPassword: string, token?: string) {
    if (!email || !newPassword) throw new BadRequestException('Email y contraseña son requeridos');
    if (newPassword.length < 6) throw new BadRequestException('Contraseña mínimo 6 caracteres');

    try {
      const user = await this.firebase.auth().getUserByEmail(email);
      await this.firebase.auth().updateUser(user.uid, { password: newPassword });
      await this.firebase.auth().revokeRefreshTokens(user.uid);
      return { message: 'Contraseña actualizada exitosamente', email, uid: user.uid };
    } catch (error) {
      this.logger.error('Error actualizando contraseña:', error);
      throw new BadRequestException('No se pudo actualizar la contraseña');
    }
  }
}
