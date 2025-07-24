import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class FriendSuggestionType {
  @Field(() => ID)
  userId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Int)
  mutualCount: number;
}
