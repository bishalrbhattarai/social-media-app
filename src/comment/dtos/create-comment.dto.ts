import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  postId: string;

  @Field()
  content: string;

  @Field(()=>String,{ nullable: true, defaultValue: null })
  parentCommentId: string | null;
}
