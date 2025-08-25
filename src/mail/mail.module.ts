import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { TestMailController } from './test.mail.controller';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true})],
    controllers: [TestMailController],
    providers: [ MailService ],
    exports: [ MailService],
})
export class MailModule {}