import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class RecentComment {
  @Prop()
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop()
  authorName: string;

  @Prop()
  commentId: string;
}

export const RecentCommentSchema = SchemaFactory.createForClass(RecentComment);

@Schema({ timestamps: true })
export class Post {
  @Prop()
  description: string;

  @Prop()
  authorName: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  authorId: Types.ObjectId;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Number, default: 0 })
  commentsCount: number;

  @Prop({ type: [RecentComment], default: [] })
  recentComments: RecentComment[];

}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
