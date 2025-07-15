import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailVerificationJobService } from './email-verification.service';
import { EmailVerificationProcessor } from './email.processor';
import { UpdateCommentProcessor } from './update-comment.processor';
import { UpdateCommentService } from './update-comment.service';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    PostModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email-verification',
    }),
    BullModule.registerQueue({
      name: 'comment',
    }),
    EmailModule,
  ],
  providers: [
    EmailVerificationProcessor,
    EmailVerificationJobService,
    UpdateCommentProcessor,
    UpdateCommentService,
  ],
  exports: [UpdateCommentService, EmailVerificationJobService],
})
export class JobModule implements OnModuleInit {
  onModuleInit() {
    console.log('JobModule initialized');
  }
}
