import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { PushService } from './push/push.service';

@Module({
  providers: [EmailService, SmsService, PushService]
})
export class ChannelsModule {}
