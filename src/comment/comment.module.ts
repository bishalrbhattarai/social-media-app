import { forwardRef, Module } from '@nestjs/common';
import { CommentResolver } from './resolvers/comment.resolver';
import { CommentService } from './services/comment.service';
import { DatabaseModule } from 'src/database/database.module';
import { Comment } from './entities/comment.schema';
import { CommentSchema } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { UserModule } from 'src/user/user.module';
import { JobModule } from 'src/job/job.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    PostModule,
    forwardRef(() => JobModule),
    UserModule,
    DatabaseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [CommentResolver, CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
