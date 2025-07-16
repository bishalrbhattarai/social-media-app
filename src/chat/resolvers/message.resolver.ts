import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { MessageService } from '../services/message.service';
import { MessageConnection, MessageType } from '../entities/message.entity';

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


  @Query(() => MessageConnection)
  async getMessages(
    @CurrentUser() user: User,
    @Args('conversationId') conversationId: string,
    @Args('first', { nullable: true, defaultValue: 10 }) first: number,
    @Args('after', { nullable: true }) after?: string,
  ): Promise<MessageConnection> {
    return this.messageService.getMessagesConnection(
      user,
      conversationId,
      first,
      after,
    );
  }



}
