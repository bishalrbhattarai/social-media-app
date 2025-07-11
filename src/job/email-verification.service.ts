import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailVerificationJobService {
  constructor(
    @InjectQueue('email-verification')
    private readonly emailQueue: Queue,
  ) {}

  async addJob(to: string, token: string) {
    console.log(`inside the addJob method of EmailVerificationJobService`);
     this.emailQueue.add('send-verification-email', {
      to,
      token,
    });
  }
}
