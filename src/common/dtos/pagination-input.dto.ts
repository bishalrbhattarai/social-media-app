import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationInput {

  @Field(() => Number, { nullable:true, defaultValue:10 })
  @IsPositive()
  @IsNumber()
  first: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  after?: string;

  @Field({ nullable: true }) 
  @IsOptional()
  search?: string;

}
