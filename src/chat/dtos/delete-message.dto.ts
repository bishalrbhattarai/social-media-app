import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteMessageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  messageId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
