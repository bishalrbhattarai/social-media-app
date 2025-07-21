import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostInput, UpdatePostInput } from '../dtos/post.dto';
import { User } from 'src/auth/resolvers/auth.resolver';
import mongoose, { UpdateQuery } from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { CreatePostResponse } from '../response/create-post.response';
import { toPostType } from '../mappers/post.mapper';
import { PaginationInput } from '../dtos/pagination.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PostDocument } from '../entities/post.schema';
import { LikeService } from 'src/like/services/like.service';
import { UpdatePostResponse } from '../response/update-post.response';
import { DeletePostJobService } from 'src/job/delete-post.service';
import { PostConnection } from '../entities/post.connection';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly likeService: LikeService,
    private readonly deletePostJobService: DeletePostJobService,
  ) {}

  async findByIdAndUpdate(postId: string, update: UpdateQuery<PostDocument>) {
    return this.postRepository.updateOne(
      { _id: new mongoose.Types.ObjectId(postId) },
      update,
    );
  }

  async findAllPosts(
    input: PaginationInput,
    user: User,
  ): Promise<PostConnection> {
    const { first = 5, after, search } = input;

    const filter: any = {};
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    if (after) {
      filter._id = { $lt: after };
    }

    const posts = await this.postRepository.find(filter, {
      first: first + 1,
      after,
    });

    const hasNextPage = posts.length > first;
    const slicedPosts = hasNextPage ? posts.slice(0, first) : posts;


    const postIds = slicedPosts.map((p) => String(p._id));
    const likedDocs = await this.likeService.findLikesByUserForPosts(
      user._id,
      postIds,
    );
    const likedPostIds = new Set(
      likedDocs.map((like) => like.postId.toString()),
    );

    const edges = slicedPosts.map((post) => ({
      node: {
        ...toPostType(post),
        isLikedByMe: likedPostIds.has(String(post._id)),
      },
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

  async findMyPosts(
    user: User,
    input: PaginationInput,
  ): Promise<PostConnection> {
    const { first = 5, after } = input;

    const posts = await this.postRepository.find(
      { authorId: new mongoose.Types.ObjectId(user._id) },
      { first: first + 1, after },
    );

    const hasNextPage = posts.length > first;
    const slicedPosts = hasNextPage ? posts.slice(0, first) : posts;

    const postIds = slicedPosts.map((p) => String(p._id));

    const likedDocs = await this.likeService.findLikesByUserForPosts(
      user._id,
      postIds,
    );

    const likedPostIds = new Set(
      likedDocs.map((like) => like.postId.toString()),
    );
    console.log(likedPostIds);

    const edges = slicedPosts.map((post) => ({
      node: {
        ...toPostType(post),
        isLikedByMe: likedPostIds.has(String(post._id)),
      },
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

  async deletePost(id: string) {
    const deletedPost = await this.postRepository.delete({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!deletedPost)
      throw new NotFoundException('Post not found or already deleted');
    
    this.deletePostJobService.addJob(id)
    return {
      message: 'Post deleted successfully',
    };
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

  async updatePost(
    postId: string,
    updatedPostInput: UpdatePostInput,
    user: User,
  ): Promise<UpdatePostResponse> {
    const post = await this.postRepository.findOne({
      _id: new mongoose.Types.ObjectId(postId),
      authorId: new mongoose.Types.ObjectId(user._id),
    });

    if (!post)
      throw new NotFoundException('Post not found or you are not the author');

    if (updatedPostInput.image) {
      const file = await updatedPostInput.image;
      const uploadResult = await this.cloudinaryService.uploadStream(file);
      const imageUrl = uploadResult.secure_url;
      updatedPostInput.image = imageUrl;
    }

    const updatedPost = await this.postRepository.updateOne(
      {
        _id: new mongoose.Types.ObjectId(postId),
        authorId: new mongoose.Types.ObjectId(user._id),
      },
      updatedPostInput,
    );

    if (!updatedPost)
      throw new NotFoundException('Post not found or update failed');

    return {
      message: 'Post updated successfully',
      post: toPostType(updatedPost),
    };
  }
}
