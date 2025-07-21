import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  postId: string;

  @Field(() => ID)
  authorId: string;

  @Field()
  authorName: string;

  @Field()
  content: string;

  @Field(() => ID, { nullable: true })
  parentCommentId?: string | null;

  @Field(()=>String,{ nullable: true ,defaultValue:"" })
  parentContent?: string | null;
}
