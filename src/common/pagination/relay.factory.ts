import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info';

export function ConnectionType<T>(classRef: Type<T>, name: string) {
  @ObjectType(`${name}Edge`)
  class EdgeType {
    @Field(() => classRef)
    node: T;

    @Field()
    cursor: string;
  }

  @ObjectType(`${name}Connection`)
  class ConnectionTypeClass {
    @Field(() => [EdgeType])
    edges: EdgeType[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }

  return ConnectionTypeClass;
}
