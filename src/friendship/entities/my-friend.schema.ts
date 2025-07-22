import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MyFriend {
  @Prop({ unique: true })
  userId: string;

  @Prop({ type: [String] })
  friends: string[];
}

export type MyFriendDocument = MyFriend & Document;
export const MyFriendSchema = SchemaFactory.createForClass(MyFriend);

MyFriendSchema.index({ friends: 1 });
