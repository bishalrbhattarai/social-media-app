import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/user/entities/user.entity';
import { UserDocument } from 'src/user/entities/user.schema';

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

  @Field(() => UserType)
  user: UserDocument;
}
