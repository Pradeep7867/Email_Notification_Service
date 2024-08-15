import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { EmailService } from 'src/channels/email/email.service';

@Module({
  imports: [],
  providers: [NotificationService, EmailService],
  controllers: [NotificationController]
})
export class NotificationModule {}
