import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseRepository } from 'src/database/database.repository';
import { MyFriend, MyFriendDocument } from '../entities/my-friend.schema';
import { Model } from 'mongoose';

@Injectable()
export class MyFriendRepository extends DatabaseRepository<MyFriendDocument> {
  constructor(
    @InjectModel(MyFriend.name)
    protected readonly model: Model<MyFriendDocument>,
  ) {
    super(model);
  }
}
