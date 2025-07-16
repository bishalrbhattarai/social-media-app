import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.schema';
import { Message, MessageSchema } from './entities/message.schema';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from './repositories/conversation.repository';
import { ConversationService } from './services/conversation.service';
import { UserModule } from 'src/user/user.module';
import { ConversationResolver } from './resolvers/conversation.resolver';
import { MessageResolver } from './resolvers/message.resolver';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    UserModule,
    DatabaseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    MessageService,
    MessageResolver,
    ConversationResolver,
    ConversationService,
    ConversationRepository,
    MessageRepository,
  ],
})
export class ChatModule {}
