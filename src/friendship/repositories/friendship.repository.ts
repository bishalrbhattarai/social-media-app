import { DatabaseRepository } from 'src/database/database.repository';
import { Friendship, FriendshipDocument } from '../entities/friendship.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FriendshipRepository extends DatabaseRepository<FriendshipDocument> {
  constructor(
    @InjectModel(Friendship.name)
    protected readonly model: Model<FriendshipDocument>,
  ) {
    super(model);
  }
}
