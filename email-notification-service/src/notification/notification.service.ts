import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailService } from 'src/channels/email/email.service';

@Injectable()
export class NotificationService {
  private transporter;
  //

  constructor
  (private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // Set to false because port 587 uses STARTTLS
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    let attempts = 0;
    const maxRetries = 3; //Define the maximum no of retries
    while(attempts < maxRetries)
    {
      try {
        const info = await this.transporter.sendMail({
          from: this.configService.get<string>('SMTP_FROM'), // sender address
          to, // list of receivers
          subject, // Subject line
          text, // plain text body
          html, // html body (optional)
        });
        console.log('Message sent: %s', info.messageId);
        return info;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);

        if (attempts >= maxRetries) {
          console.log('Switching to backup service...');
          return this.emailService.sendMail(to, subject, html || text); // Use the backup service
        }
      }
    }
  }
  private async sendViaFallbackService(to: string, subject: string, text: string, html?: string) {
    try {
      await this.emailService.sendMail(to, subject, html || text);
      console.log('Fallback service sent the email successfully');
    } catch (error) {
      console.error('Fallback service failed to send the email:', error);
      throw error;
    }
  }
}
