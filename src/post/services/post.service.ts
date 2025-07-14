import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostInput } from '../dtos/post.dto';
import { User } from 'src/auth/resolvers/auth.resolver';
import mongoose from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { CreatePostResponse } from '../response/create-post.response';
import { toPostType } from '../mappers/post.mapper';
import { PostConnection, PostEdge } from '../entities/post.entity';
import { PaginationInput } from '../dtos/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService, 
  ) {}

  async findAllPosts(input: PaginationInput): Promise<PostConnection> {
    const { first = 5, after } = input;

    const posts = await this.postRepository.find(
      {},
      { first: first + 1, after },
    );
    const hasNextPage = posts.length > first;

    const slicedPosts = hasNextPage ? posts.slice(0, first) : posts;

    const edges: PostEdge[] = slicedPosts.map((post) => ({
      node: toPostType(post),
      cursor: String(post._id),
    }));

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    };
  }


  async deletePost(id:string){
   const deletedPost = await this.postRepository.delete({ _id: new mongoose.Types.ObjectId(id) })
    if (!deletedPost) 
      throw new NotFoundException('Post not found or already deleted');
  
    return {
      message: 'Post deleted successfully',
    }
  
  }

  async createPost(
    input: CreatePostInput,
    user: User,
  ): Promise<CreatePostResponse> {
    const existingUser = await this.userService.findOneById(user._id);
    if (!existingUser) throw new UnauthorizedException('User not found');

    let imageUrl = '';

  if (input.image) {
    const file = await input.image;
    const uploadResult = await this.cloudinaryService.uploadStream(file);
    imageUrl = uploadResult.secure_url;
  }


    const createdPost = await this.postRepository.create({
      description: input.description,
      image: imageUrl,
      authorId: new mongoose.Types.ObjectId(user._id),
      authorName: existingUser.name,
    });

    return {
      message: 'Post created successfully',
      post: toPostType(createdPost),
    };
  }
}
