import { Injectable, BadRequestException } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { User } from 'src/auth/resolvers/auth.resolver';
import { Types } from 'mongoose';
import { PostService } from 'src/post/services/post.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly postService: PostService,
  ) {}

  async likePost(user: User, postId: string): Promise<string> {
    const existingLike = await this.likeRepository.findOne({
      userId: user._id,
      postId,
    });
    if (existingLike)
      throw new BadRequestException('You have already liked this post.');

    await this.likeRepository.create({
      userId: user._id,
      postId,
    });

    await this.postService.findByIdAndUpdate(postId, {
      $inc: { likes: 1 },
    });

    return `Post ${postId} liked by user ${user._id}`;
  }

  async unlikePost(user: User, postId: string): Promise<string> {
    const userId = new Types.ObjectId(user._id);

    const deleted = await this.likeRepository.delete({ userId, postId });
    if (!deleted)
      throw new BadRequestException('You have not liked this post yet.');

    return `Like removed from post ${postId} by user ${user._id}`;
  }
}
