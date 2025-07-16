import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ConversationParticipantType {
  @Field(() => ID)
  userId: string;

  @Field()
  name: string;

  @Field({ nullable: true, defaultValue: '' })
  avatar?: string;
}

@ObjectType()
export class RecentMessageType {
  @Field(() => ID)
  senderId: string;

  @Field()
  senderName: string;

  @Field({ nullable: true ,defaultValue:""})
  senderAvatar?: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class ConversationType {
  @Field(() => ID)
  id: string;

  @Field(() => [ConversationParticipantType])
  participants: ConversationParticipantType[];

  @Field(() => [RecentMessageType])
  recentMessages: RecentMessageType[];

  @Field({ nullable: true })
  lastMessageAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
