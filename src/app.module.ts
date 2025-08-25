// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
// import { PrismaModule } from './shared/prisma.module'; // ← COMENTADO TEMPORALMENTE

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Importante para ConfigService
    }),
    // PrismaModule, // ← COMENTADO TEMPORALMENTE
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}