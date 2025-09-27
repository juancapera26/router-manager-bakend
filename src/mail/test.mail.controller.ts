//test.mail.controller.ts
import {Controller, Post, Body} from '@nestjs/common';
import {MailService} from './mail.service';

@Controller('test-mail')
export class TestMailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-reset')
  async testPasswordReset(@Body() body: {email: string}) {
    try {
      const resetLink =
        'https://mi-app.com/reset-password?token=test-token-123';

      await this.mailService.sendPasswordResetEmail(body.email, resetLink);

      return {
        success: true,
        message: 'El email fue enviado correctamente!',
        sentTo: body.email
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al enviar el email',
        error: error.message
      };
    }
  }
}
