import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MyFriendType {
  @Field(() => ID)
  userId: string;

  @Field(() => [String], { defaultValue: [] })
  friends: string[];
}
