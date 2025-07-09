import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}
registerEnumType(RoleEnum, {
  name: 'RoleEnum',
  description: 'The role of the user in the system',
});

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => RoleEnum, { defaultValue: RoleEnum.USER })
  role: RoleEnum;

  @Field()
  bio: string;

  @Field()
  avatar: string;

  @Field()
  isEmailVerified: boolean;
}
