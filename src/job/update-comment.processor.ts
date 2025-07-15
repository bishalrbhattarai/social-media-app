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

    const MAX_RECENT_COMMENTS = 5;

    await this.postService.findByIdAndUpdate(postId, {
      $push: {
        recentComments: {
          $each: [
            {
              authorId,
              authorName,
              content,
            },
          ],
          $slice: -MAX_RECENT_COMMENTS, 
        },
      },
    });

    console.log('recent comment added to post:', postId);
  }
}
