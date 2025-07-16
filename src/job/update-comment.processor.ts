import { Process, Processor } from '@nestjs/bull';
import { PostService } from 'src/post/services/post.service';

@Processor('comment')
export class UpdateCommentProcessor {
  constructor(private readonly postService: PostService) {}

  @Process('update-comment')
  async handleUpdateComment(job: any) {
    const { authorId, authorName, content, postId,commentId } = job.data;
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
              commentId
            },
          ],
          $slice: -MAX_RECENT_COMMENTS, 
        },
      },
    });

    console.log('recent comment added to post:', postId);
  }


  @Process("remove-comment")
  async handleRemoveComment(job:any) {
    const { authorId, authorName, content, commentId, postId } = job.data;
    console.log('Processing remove comment job:', {
      authorId,
      authorName,
      content,
      postId,
    });

    await this.postService.findByIdAndUpdate(postId, {
      $pull: {
        recentComments: { commentId },
      },
    });

    console.log('recent comment removed from post:', postId);
  }



}
