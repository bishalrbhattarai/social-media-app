import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from 'src/database/database.repository';
import {
  Conversation,
  ConversationDocument,
} from '../entities/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConversationRepository extends DatabaseRepository<ConversationDocument> {
  constructor(
    @InjectModel(Conversation.name)
    protected readonly model: Model<ConversationDocument>,
  ) {
    super(model);
  }
}
