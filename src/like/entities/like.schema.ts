import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: false })
  name?: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
export type LikeDocument = Like & Document;

LikeSchema.index({ postId: 1 });
LikeSchema.index({ userId: 1 });
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
