import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { MessageService } from '../services/message.service';
import { MessageType } from '../entities/message.entity';

@Resolver()
@UseGuards(AuthGuard)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => MessageType)
  async createMessage(
    @Args('conversationId') conversationId: string,
    @Args('content') content: string,
    @CurrentUser() user: User,
  ): Promise<MessageType> {
    return this.messageService.createMessage(user, conversationId, content);
  }
}
