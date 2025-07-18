import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ConversationParticipant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  avatar?: string;
}

export const ConversationParticipantSchema = SchemaFactory.createForClass(
  ConversationParticipant,
);

@Schema()
export class RecentMessage {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop()
  senderAvatar?: string;

  @Prop()
  messageId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RecentMessageSchema = SchemaFactory.createForClass(RecentMessage);

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [ConversationParticipantSchema], required: true })
  participants: ConversationParticipant[];

  @Prop({ type: [RecentMessageSchema], default: [] })
  recentMessages: RecentMessage[];

  @Prop()
  lastMessageAt?: Date;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
