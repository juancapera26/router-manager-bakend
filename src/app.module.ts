// app.module.ts
import { Module } from '@nestjs/common';
// import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // UsersModule,
    AuthModule,
  ], // 👈 delegas responsabilidad a cada módulo
})
export class AppModule {}
