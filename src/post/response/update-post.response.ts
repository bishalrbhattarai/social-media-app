import { Field, ObjectType } from '@nestjs/graphql';
import { PostType } from '../entities/post.entity';

@ObjectType()
export class UpdatePostResponse {
  @Field()
  message: string;

  @Field(() => PostType)
  post: PostType;
}
