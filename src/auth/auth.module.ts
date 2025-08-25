//auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AssignRoleController } from 'src/interface/controllers/assign-role.controller';
import { FirebaseAuthProvider } from 'src/infrastructure/auth/firebase-auth.provider';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [AuthController, AssignRoleController],
  providers: [
    FirebaseAuthProvider,
    RegisterUserUseCase,
    AuthService,
    {
      provide: 'AuthProvider',
      useClass: FirebaseAuthProvider,
    },
  ],
  exports: [FirebaseAuthProvider, AuthService],
})
export class AuthModule {}