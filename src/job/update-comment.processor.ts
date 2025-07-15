import { Process, Processor } from '@nestjs/bull';
import { PostService } from 'src/post/services/post.service';

@Processor('comment')
export class UpdateCommentProcessor {
  constructor(private readonly postService: PostService) {}

  @Process('update-comment')
  async handleUpdateComment(job: any) {
    const { authorId, authorName, content, postId } = job.data;
    console.log('Processing update comment job:', {
      authorId,
      authorName,
      content,
      postId,
    });

    await this.postService.findByIdAndUpdate(postId, {
      $push: {
        recentComments: {
          authorId,
          authorName,
          content,
        },
      },
    });

    console.log('recent comment added to post:', postId);
  }
}
