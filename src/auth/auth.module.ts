// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from 'src/interface/controllers/auth.controller';
import { AssignRoleController } from 'src/interface/controllers/assign-role.controller';
import { FirebaseAuthProvider } from 'src/infrastructure/auth/firebase-auth.provider';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';

@Module({
  controllers: [AuthController, AssignRoleController],
  providers: [
    FirebaseAuthProvider, // ✅ Solo este
    RegisterUserUseCase,
    {
      provide: 'AuthProvider', // 👈 Este es el token que Nest necesita
      useClass: FirebaseAuthProvider,
    },
  ],
  exports: [FirebaseAuthProvider],
})
export class AuthModule {} // ✅ Esta es la clase real del módulo
