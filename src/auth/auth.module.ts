//auth.module.ts

// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; // ⚠️ la ruta correcta
import { AuthService } from './auth.service'; // ⚠️ agrega el servicio
import { MailModule } from '../mail/mail.module'; // si tu AuthService usa MailService
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
