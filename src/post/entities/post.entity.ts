import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecentCommentType {
  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field()
  authorName: string;

  @Field()
  commentId: string;
}

@ObjectType()
export class PostType {
  @Field(() => String)
  id: string;

  @Field()
  description: string;

  @Field()
  authorName: string;

  @Field()
  authorId: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Number, { defaultValue: 0 })
  likes: number;

  @Field(() => Number, { defaultValue: 0 })
  commentsCount: number;

  @Field(() => [RecentCommentType], { defaultValue: [], nullable: true })
  recentComments: RecentCommentType[];
}

@ObjectType()
export class PostEdge {
  @Field(() => PostType)
  node: PostType;

  @Field()
  cursor: string;
}

@ObjectType()
export class PageInfo {
  @Field(()=>String,{ nullable: true })
  endCursor?: string | null;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class PostConnection {
  @Field(() => [PostEdge])
  edges: PostEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
