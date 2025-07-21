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


  @Field(()=>Boolean,{ nullable:true,defaultValue:false})
  isLikedByMe?:boolean


}


