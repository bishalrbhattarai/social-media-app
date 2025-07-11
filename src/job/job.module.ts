import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailVerificationJobService } from './email-verification.service';
import { EmailVerificationProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-verification',
    }),
    EmailModule,
  ],
  providers: [EmailVerificationProcessor, EmailVerificationJobService],
  exports: [EmailVerificationJobService],
})
export class JobModule {}
