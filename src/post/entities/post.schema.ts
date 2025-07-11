import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop()
  description: string;

  @Prop()
  authorName: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  likes: number;

  @Prop()
  commentsCount: number;

  recentComments: [
    {
      content: string;
      authorId: { type: Types.ObjectId; ref: 'User' };
      authorName: string;
    },
  ];
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
