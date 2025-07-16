import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MessageType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  conversationId: string;

  @Field(() => ID)
  senderId: string;

  @Field()
  senderName: string;

  @Field({ nullable: true })
  senderAvatar?: string;

  @Field()
  content: string;

  @Field()
  read: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class MessageEdge {
  @Field(() => MessageType)
  node: MessageType;

  @Field()
  cursor: string; 
}

@ObjectType("MessagePageInfo")
export class PageInfo {
  @Field(()=>String,{ nullable: true,defaultValue:null })
  endCursor?: string | null;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class MessageConnection {
  @Field(() => [MessageEdge])
  edges: MessageEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
