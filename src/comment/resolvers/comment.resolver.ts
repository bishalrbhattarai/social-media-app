import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/auth/resolvers/auth.resolver';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCommentInput } from '../dtos/create-comment.dto';
import { DeleteCommentInput } from '../dtos/delete-comment.dto';
import { CommentService } from '../services/comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Resolver()
@UseGuards(AuthGuard)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => String)
  createComment(
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.commentService.createComment(
      input.postId,
      user,
      input.content,
      input.parentCommentId ?? null,
    );
  }

  @Mutation(() => String)
  deleteComment(
    @Args('input') input: DeleteCommentInput,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.commentService.deleteComment(
      input.postId,
      input.commentId,
      user,
    );
  }
}
