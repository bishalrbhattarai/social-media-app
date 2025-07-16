import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../entities/message.schema';

@Injectable()
export class MessageRepository extends DatabaseRepository<MessageDocument> {
  constructor(
    @InjectModel(Message.name)
    protected readonly model: Model<MessageDocument>,
  ) {
    super(model);
  }
}
