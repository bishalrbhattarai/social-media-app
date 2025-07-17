import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CommentService } from 'src/comment/services/comment.service';
import { LikeService } from 'src/like/services/like.service';

@Processor('post')
export class DeletePostProcessor {
  constructor(
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
  ) {}

  @Process('delete-post')
  async handleDeletePost(job: Job) {
    const { postId } = job.data;
    console.log('Processing delete post job:', { postId });

    (await this.commentService.deleteMany(postId),
      await this.likeService.deleteMany(postId),
      console.log('Post and associated comments and likes deleted:', postId));
  }
}
