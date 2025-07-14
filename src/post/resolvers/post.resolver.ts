import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostResponse } from '../response/create-post.response';
import { CreatePostInput } from '../dtos/post.dto';
import { PostService } from '../services/post.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { PostConnection } from '../entities/post.entity';
import { PaginationInput } from '../dtos/pagination.dto';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostResponse)
  @UseGuards(AuthGuard)
  createPost(
    @CurrentUser() user: User,
    @Args('input') input: CreatePostInput,
  ): Promise<CreatePostResponse> {
    return this.postService.createPost(input, user);
  }

  @Query(() => PostConnection)
  async posts(
    @Args('input', { nullable: true, defaultValue: { first: 5 } })
    input: PaginationInput,
  ): Promise<PostConnection> {
    return this.postService.findAllPosts(input);
  }
}
