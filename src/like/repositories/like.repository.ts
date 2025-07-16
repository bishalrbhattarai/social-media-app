import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import { LikeDocument, Like } from '../entities/like.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LikeRepository extends DatabaseRepository<LikeDocument> {
  constructor(
    @InjectModel(Like.name) protected readonly model: Model<LikeDocument>,
  ) {
    super(model);
  }
}
