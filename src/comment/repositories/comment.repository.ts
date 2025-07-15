import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import { Comment, CommentDocument } from '../entities/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository extends DatabaseRepository<CommentDocument> {
  constructor(
    @InjectModel(Comment.name) protected readonly model: Model<CommentDocument>,
  ) {
    super(model);
  }
}
