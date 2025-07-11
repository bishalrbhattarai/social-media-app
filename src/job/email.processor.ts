import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('email-verification')
@Injectable()
export class EmailVerificationProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job) {
    console.log(`[Queue] Processing job: ${job.id} - Sending verification email to ${job.data.to}`);
    const { to, token } = job.data;

    await this.emailService.sendVerificationEmail(to, token);

    console.log(`[Queue] Verification email sent to ${to}`);
  }
}
