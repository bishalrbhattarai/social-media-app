import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('email-verification')
export class EmailVerificationProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-verification-email')
  async handleSendVerificationEmail(job: Job) {
    const { to, token } = job.data;

    await this.emailService.sendVerificationEmail(to, token);

    console.log(`[Queue] Verification email sent to ${to}`);
  }
}
