import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/auth/resolvers/auth.resolver';
import { MessageRepository } from '../repositories/message.repository';
import { ConversationRepository } from '../repositories/conversation.repository';
import { UserService } from 'src/user/services/user.service';
import { MessageType } from '../entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
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

    // ✉️ Create message document
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

    return {
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
  }
}
