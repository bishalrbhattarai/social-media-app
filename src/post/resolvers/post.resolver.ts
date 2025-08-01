import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostResponse } from '../response/create-post.response';
import { CreatePostInput, UpdatePostInput } from '../dtos/post.dto';
import { PostService } from '../services/post.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { PostConnection } from '../entities/post.connection';
import { DeletePostResponse } from '../response/delete-post.response';
import { UpdatePostResponse } from '../response/update-post.response';
import { PaginationInput } from 'src/common/dtos/pagination-input.dto';

@Resolver()
@UseGuards(AuthGuard)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => CreatePostResponse)
  createPost(
    @CurrentUser() user: User,
    @Args('input') input: CreatePostInput,
  ): Promise<CreatePostResponse> {
    return this.postService.createPost(input, user);
  }

  @Query(() => PostConnection)
  async posts(
    @CurrentUser() user: User,
    @Args('input', { nullable: true, defaultValue: { first: 5 } })
    input: PaginationInput,
  ): Promise<PostConnection> {
    return this.postService.findAllPosts(input,user);
  }

  @Query(() => PostConnection)
  async myPosts(
    @CurrentUser() user: User,
    @Args('input', { nullable: true, defaultValue: { first: 5 } })
    input: PaginationInput,
  ): Promise<PostConnection> {
    return this.postService.findMyPosts(user, input);
  }

  @Mutation(() => DeletePostResponse)
  async deletePost(@Args('id') id: string): Promise<DeletePostResponse> {
    return this.postService.deletePost(id);
  }


@Mutation(() => UpdatePostResponse)
async updatePost(
  @Args('postId') postId: string,
  @Args('input') input: UpdatePostInput,
  @CurrentUser() user: User,
): Promise<UpdatePostResponse> { 
  return this.postService.updatePost(postId, input, user);
}


}
