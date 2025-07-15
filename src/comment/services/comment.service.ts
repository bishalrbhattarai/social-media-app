import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { User } from 'src/auth/resolvers/auth.resolver';
import { UserService } from 'src/user/services/user.service';
import { UpdateCommentService } from 'src/job/update-comment.service';
import { PostService } from 'src/post/services/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly updateCommentService: UpdateCommentService,
    private readonly postService: PostService,
  ) {}

  async createComment(
    postId: string,
    user: User,
    content: string,
    parentCommentId?: string | null,
  ): Promise<string> {
    const currentUser = await this.userService.findOneById(user._id);
    if (!currentUser) throw new NotFoundException('User not found');

    const createdComment = await this.commentRepository.create({
      postId,
      authorId: user._id,
      authorName: currentUser.name,
      parentCommentId,
      content,
    });

    await this.postService.findByIdAndUpdate(String(createdComment._id), {
      $inc: { commentCount: 1 },
    });


    if (!createdComment.parentCommentId) {
      this.updateCommentService.addJob(
        createdComment.authorId,
        createdComment.authorName,
        createdComment.content,
        postId,
        String(createdComment._id),
      );
    }

    return 'Comment created successfully';
  }
}
