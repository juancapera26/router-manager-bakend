// src/auth/auth.module.ts
import {Module} from '@nestjs/common';
import {AuthController} from 'src/interface/controllers/auth.controller';
import {AuthService} from '../../../auth/auth.service';
import {MailModule} from '../../../mail/mail.module';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';

// 👉 importa tus dependencias
import {FirebaseAuthProvider} from 'src/infrastructure/auth/firebase-auth.provider';
import {RegisterUserUseCase} from 'src/application/auth/use-cases/register-user.use-case';

@Module({
  imports: [InfrastructureModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseAuthProvider, // ✅ añadido
    RegisterUserUseCase // ✅ añadido
  ]
})
export class AuthModule {}
