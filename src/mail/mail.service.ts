import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT') ?? 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });

    this.from = `${this.config.get('APP_NAME')} <${this.config.get('SMTP_USER')}>`;
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const app = this.config.get('APP_NAME');
    const html = `
      <p>Hemos recibido tu solicitud para el cambio de contraseña en <b>${app}</b>.</p>
      <p>Haz click en el botón para hacerlo:</p>
      <p><a href="${resetLink}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Restablecer contraseña</a></p>
      <p>Si no solicitaste esto ignora el mensaje.</p>
    `;

    await this.transporter.sendMail({ 
    from: this.from,
    to,
    subject: 'Restablecer contraseña', html }
  ),(err, info) => {
    if (err) {
      this.logger.error('Error al enviar email', err);
    } else {
      this.logger.log('Respuesta del servidor SMTP: '+ info.resonse);
    }
  }
    this.logger.log(`Reset email enviado a ${to}`);
  }
}
