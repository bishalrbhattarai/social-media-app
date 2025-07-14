import { DatabaseRepository } from 'src/database/database.repository';
import { Post, PostDocument } from '../entities/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository extends DatabaseRepository<PostDocument> {
  constructor(
    @InjectModel(Post.name) protected readonly postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
}
