import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import { User, UserDocument } from '../entities/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends DatabaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) protected readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
