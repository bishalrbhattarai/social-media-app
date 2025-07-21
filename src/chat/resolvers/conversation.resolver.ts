import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { ConversationService } from '../services/conversation.service';
import { ConversationType } from '../entities/conversation.entity';

@Resolver()
@UseGuards(AuthGuard)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Mutation(() => ConversationType)
  @UseGuards(AuthGuard)
  async createConversation(
    @Args('receiverId') receiverId: string,
    @CurrentUser() user: User,
  ) {
    return this.conversationService.createConversation(receiverId, user);
  }
}
