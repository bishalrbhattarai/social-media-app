import { Field, ObjectType } from '@nestjs/graphql';
import { PostType } from '../entities/post.entity';

@ObjectType()
export class CreatePostResponse {
  @Field()
  message: string;

  @Field(() => PostType)
  post: PostType;
}
