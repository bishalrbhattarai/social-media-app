import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DeletePostResponse {
    @Field()
  message: string;
}