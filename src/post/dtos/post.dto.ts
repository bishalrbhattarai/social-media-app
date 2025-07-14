import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  image?: Promise<FileUpload>;
}
