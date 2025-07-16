import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LikeType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  postId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class LikeEdge {
  @Field(() => LikeType)
  node: LikeType;

  @Field()
  cursor: string;
}

@ObjectType()
export class LikePageInfo {
  @Field(() => String, { nullable: true })
  endCursor?: string | null;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class LikeConnection {
  @Field(() => [LikeEdge])
  edges: LikeEdge[];

  @Field(() => LikePageInfo)
  pageInfo: LikePageInfo;
}
