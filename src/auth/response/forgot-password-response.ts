import { Field, ObjectType } from '@nestjs/graphql';
import { GenericResponse } from './response';

@ObjectType()
export class ForgotPasswordResponse extends GenericResponse {
}
