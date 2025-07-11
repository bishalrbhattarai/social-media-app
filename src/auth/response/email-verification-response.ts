import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailVerificationResponse {
  @Field()
  message: string;
}
