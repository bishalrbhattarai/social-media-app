import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostType {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field()
  authorName: string;

  @Field()
  authorId: string;

  @Field(() => [String])
  images: string[];
}
