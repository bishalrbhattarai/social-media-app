import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  postId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(()=>String,{ nullable: true, defaultValue: null })
  @IsOptional()
  parentCommentId: string | null;
}
