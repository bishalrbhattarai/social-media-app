import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericResponse {
  @Field()
  message: string;
}
