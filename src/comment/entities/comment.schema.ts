import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  authorId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  content: string;

  @Prop({required:false,default:""})
  parentContent: string;


  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment', default: null })
  parentCommentId?: string | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export type CommentDocument = Comment & Document;

CommentSchema.index({ postId: 1, parentCommentId: 1, createdAt: 1 });
CommentSchema.index({ authorId: 1 });
