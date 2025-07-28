// src/interface/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseAuthProvider } from 'src/infrastructure/auth/firebase-auth.provider';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseAuthProvider: FirebaseAuthProvider) {}

  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
  ): Promise<
    | { success: true; uid: string; token: string; role: string }
    | { success: true; uid: string; role: string }
  > {
    const { email, password, role, isPublicRegistration } = body;

    const uid = await this.firebaseAuthProvider.createUser(email, password);
    await this.firebaseAuthProvider.setRole(uid, role);

    // 3. Validar el rol fue correctamente asignado
    const actualRole = await this.firebaseAuthProvider.getRole(uid);
    if (actualRole !== role) {
      throw new Error(
        `❌ El rol no fue asignado correctamente. Se esperaba: ${role}, pero se obtuvo: ${actualRole}`,
      );
    }

    // Solo si viene del frontend público (registro abierto)
    if (isPublicRegistration === true) {
      const customToken =
        await this.firebaseAuthProvider.generateCustomToken(uid);
      return {
        success: true,
        uid,
        role: actualRole,
        token: customToken,
      };
    }

    return {
      success: true,
      role: actualRole,
      uid,
    };
  }
}
