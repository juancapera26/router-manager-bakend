// app.module.ts
import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PaquetesModule } from './paquetes/paquetes.module';

@Module({
  imports: [UsersModule, AuthModule, MailModule, PaquetesModule],
})
export class AppModule {}
