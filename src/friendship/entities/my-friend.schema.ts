import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class MyFriend {
  @Prop({ type:SchemaTypes.ObjectId, unique: true })
  userId: string;

  @Prop({ type: [String] })
  friends: string[];
}

export type MyFriendDocument = MyFriend & Document;
export const MyFriendSchema = SchemaFactory.createForClass(MyFriend);

MyFriendSchema.index({ friends: 1 });
