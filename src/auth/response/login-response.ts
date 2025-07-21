import { Field, ObjectType } from '@nestjs/graphql';
import { GenericResponse } from './response';

@ObjectType()
export class LoginResponse extends GenericResponse {
  @Field()
  accessToken: string;
}
