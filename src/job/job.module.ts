import { BullModule } from '@nestjs/bull';
import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailVerificationJobService } from './email-verification.service';
import { EmailVerificationProcessor } from './email.processor';
import { UpdateCommentProcessor } from './update-comment.processor';
import { UpdateCommentService } from './update-comment.service';
import { PostModule } from 'src/post/post.module';
import { DeletePostJobService } from './delete-post.service';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';
import { DeletePostProcessor } from './delete-post.processor';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordProcessor } from './forgot-password.processor';

@Module({
  imports: [
    PostModule,
    LikeModule,
    forwardRef(() => CommentModule),
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
    BullModule.registerQueue({
      name: 'post',
    }),
    BullModule.registerQueue({
      name: 'forgot-password',
    }),
    EmailModule,
  ],
  providers: [
    EmailVerificationProcessor,
    EmailVerificationJobService,
    UpdateCommentProcessor,
    UpdateCommentService,
    DeletePostJobService,
    DeletePostProcessor,
    ForgotPasswordService,
    ForgotPasswordProcessor
  ],
  exports: [
    UpdateCommentService,
    EmailVerificationJobService,
    DeletePostJobService,
    ForgotPasswordService,
  ],
})
export class JobModule implements OnModuleInit {
  onModuleInit() {
    console.log('JobModule initialized');
  }
}
