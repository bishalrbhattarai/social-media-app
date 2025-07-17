import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { MessageService } from '../services/message.service';
import { MessageConnection, MessageType } from '../entities/message.entity';
import { PUB_SUB } from 'src/pubsub/pubsub.provider';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => MessageType)
  @UseGuards(AuthGuard)
  async createMessage(
    @Args('conversationId') conversationId: string,
    @Args('content') content: string,
    @CurrentUser() user: User,
  ): Promise<MessageType> {
    return this.messageService.createMessage(user, conversationId, content);
  }

  @Query(() => MessageConnection)
  @UseGuards(AuthGuard)
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

  @Subscription(() => MessageType, {
    filter: (payload, variables, context) => {

      console.log(`the context is`);
      console.log(context);

      console.log("the payload");
      console.log(payload);

      if (payload.conversationId !== variables.conversationId) {
        return false;
      }

  

      const user = context.user;
      if (!user || !user._id) {
        console.log('Subscription rejected: No authenticated user');
        return false;
      }

      return true;
    },
  })
  messageAdded(
    @Args('conversationId') conversationId: string,
  ) {
    return this.pubSub.asyncIterator(`messageAdded.${conversationId}`);
  }
}
