import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCommentInput {
  @Field()
  postId: string;

  @Field()
  commentId: string;
}
