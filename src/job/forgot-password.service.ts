import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ForgotPasswordService {
  constructor(@InjectQueue('forgot-password') private readonly queue: Queue) {}

  async sendResetPasswordEmail(email: string, token: string) {
     this.queue.add('send-reset-password-email', {
      email,
      token,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    return `Password reset successful with token ${token}`;
  }
}
