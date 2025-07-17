import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Number, { nullable:true, defaultValue: 5 })
  @IsOptional()
  first?: number;

  @Field(() => String, { nullable: true })
@IsOptional()
  after?: string;



  @Field({ nullable: true }) 
  @IsOptional()
  search?: string;

}
