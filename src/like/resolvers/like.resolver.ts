import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { LikeService } from '../services/like.service';

@Resolver()
@UseGuards(AuthGuard)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => String)
  async likePost(
    @Args('postId') postId: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.likeService.likePost(user, postId);
  }

  @Mutation(() => String)
  async unlikePost(
    @Args('postId') postId: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.likeService.unlikePost(user, postId);
  }
}
