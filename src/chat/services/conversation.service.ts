import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/auth/resolvers/auth.resolver';
import { ConversationRepository } from '../repositories/conversation.repository';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UserService,
  ) {}

  async createConversation(receiverId: string, user: User) {
    if (receiverId === user._id) {
      throw new BadRequestException(
        'You cannot create a conversation with yourself.',
      );
    }

    const receiver = await this.userService.findOneById(receiverId);
    const sender = await this.userService.findOneById(user._id);

    if (!receiver) throw new BadRequestException('Receiver not found.');
    if (!sender) throw new BadRequestException('Sender not found.');

    const existingConversation = await this.conversationRepository.findOne({
      $and: [
        { 'participants.userId': user._id.toString() },
        { 'participants.userId': receiverId },
      ],
    });
    if (existingConversation) return existingConversation;

    const participants = [
      {
        userId: user._id,
        name: sender.name,
        avatar: sender.avatar ?? null,
      },
      {
        userId: String(receiver._id),
        name: receiver.name,
        avatar: receiver.avatar ?? null,
      },
    ];

    return await this.conversationRepository.create({
      participants,
      recentMessages: [],
      lastMessageAt: new Date(),
    });
  }
}
