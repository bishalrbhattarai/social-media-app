import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/auth/resolvers/auth.resolver';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationRepository } from '../repositories/conversation.repository';
import { UserService } from 'src/user/services/user.service';
import {
  MessageConnection,
  MessageEdge,
  MessageType,
} from '../entities/message.entity';
import { PUB_SUB } from 'src/pubsub/pubsub.provider';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  async createMessage(
    user: User,
    conversationId: string,
    content: string,
  ): Promise<MessageType> {
    const conversation = await this.conversationRepository.findOne({
      _id: new Types.ObjectId(conversationId),
      'participants.userId': user._id,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    const currentUser = await this.userService.findOneById(user._id);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const createdMessage = await this.messageRepository.create({
      conversationId: conversationId,
      senderId: user._id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content,
      read: false,
    });

    const updatedRecentMessages = [
      ...conversation.recentMessages,
      {
        senderId: user._id.toString(),
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        content,
        createdAt: new Date(),
      },
    ].slice(-100);

    await this.conversationRepository.updateOne(
      { _id: conversationId },
      {
        recentMessages: updatedRecentMessages,
        lastMessageAt: new Date(),
      },
    );

    const messageResult = {
      id: String(createdMessage._id),
      conversationId: createdMessage.conversationId.toString(),
      senderId: createdMessage.senderId.toString(),
      senderName: createdMessage.senderName,
      senderAvatar: createdMessage.senderAvatar,
      content: createdMessage.content,
      read: createdMessage.read,
      createdAt: createdMessage.createdAt,
      updatedAt: createdMessage.updatedAt,
    };


    await this.pubSub.publish(`messageAdded.${conversationId}`, {
      messageAdded: messageResult,
      conversationId,
    });

    return messageResult;
  }

  async getMessagesConnection(
    user: User,
    conversationId: string,
    first = 10,
    after?: string,
  ): Promise<MessageConnection> {
    const conversation = await this.conversationRepository.findOne({
      _id: conversationId,
      'participants.userId': user._id,
    });
    if (!conversation) throw new ForbiddenException('Access denied');

    const baseQuery = { conversationId };

    const cursorFilter = after
      ? { _id: { $lt: new Types.ObjectId(after) } }
      : {};

    const query = { ...baseQuery, ...cursorFilter };

    const limit = first + 1;

    const messages = await this.messageRepository.find(query, {
      first: limit,
      after,
      sort: { _id: -1 },
    });

    const hasNextPage = messages.length > first;

    const slicedMessages = hasNextPage ? messages.slice(0, first) : messages;

    const edges: MessageEdge[] = slicedMessages.map((msg) => ({
      node: {
        id: String(msg._id),
        conversationId: msg.conversationId.toString(),
        senderId: msg.senderId.toString(),
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        content: msg.content,
        read: msg.read,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      },
      cursor: String(msg._id),
    }));

    const endCursor: string | undefined =
      edges.length > 0 ? edges[edges.length - 1].cursor : undefined;

    return {
      edges,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    };
  }

  async verifyConversationAccess(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    const conversation = await this.conversationRepository.findOne({
      _id: new Types.ObjectId(conversationId),
      'participants.userId': userId,
    });
    return !!conversation;
  }
}
