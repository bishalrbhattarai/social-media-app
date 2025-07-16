import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { User } from 'src/auth/resolvers/auth.resolver';
import { UserService } from 'src/user/services/user.service';
import { UpdateCommentService } from 'src/job/update-comment.service';
import { PostService } from 'src/post/services/post.service';
import mongoose from 'mongoose';

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

    await this.postService.findByIdAndUpdate(String(postId), {
      $inc: { commentsCount: 1 },
    });

    if (!createdComment.parentCommentId) {
      this.updateCommentService.addCommentJob(
        createdComment.authorId,
        createdComment.authorName,
        createdComment.content,
        postId,
        String(createdComment._id),
      );
    }

    return 'Comment created successfully';
  }

  async deleteComment(
    postId: string,
    commentId: string,
    user: User,
  ): Promise<string> {
    const comment = await this.commentRepository.findOne({
      _id: new mongoose.Types.ObjectId(commentId),
      postId,
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.authorId.toString() !== user._id)
      throw new UnauthorizedException('You can only delete your own comments');

    await this.commentRepository.delete({
      _id: new mongoose.Types.ObjectId(commentId),
    });

    await this.postService.findByIdAndUpdate(postId, {
      $inc: { commentsCount: -1 },
    });

    this.updateCommentService.removeCommentJob(
      new mongoose.Types.ObjectId(user._id),
      comment.authorName,
      comment.content,
      commentId,
      postId,
    );

    return 'Comment deleted successfully';
  }
}
