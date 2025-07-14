import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 5 })
  @IsOptional()
  first: number;

  @Field(() => String, { nullable: true })
@IsOptional()
  after?: string;
}
