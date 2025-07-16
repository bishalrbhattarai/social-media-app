import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop()
  senderAvatar?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;


  @Prop()
  createdAt: Date;


  @Prop()
  updatedAt: Date;

}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
