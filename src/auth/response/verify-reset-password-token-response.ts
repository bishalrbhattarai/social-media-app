import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifyResetPasswordTokenResponse {
  @Field()
  message: string;
}
