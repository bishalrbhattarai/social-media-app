import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('forgot-password')
export class ForgotPasswordProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-reset-password-email')
  async handleSendResetPasswordEmail(job: Job) {
    const { email, token } = job.data;

    await this.emailService.sendPasswordResetEmail(email, token);

    console.log(
      'Processing send-reset-password-email job with data:',
      job.data,
    );
  }
}
