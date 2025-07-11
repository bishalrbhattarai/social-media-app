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
    const { to, token } = job.data;

    await this.emailService.sendVerificationEmail(to, token);

  }
}
