import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';

export enum FriendshipStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
  Blocked = 'blocked',
}

registerEnumType(FriendshipStatus, {
  name: 'FriendshipStatus',
  description: 'Status of the friendship',
});

@ObjectType()
export class FriendshipType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  requester: string;

  @Field()
  requesterName: string;

  @Field(() => ID)
  recipient: string;

  @Field()
  recipientName: string;

  @Field({ nullable: true })
  requesterAvatar?: string;

  @Field({ nullable: true })
  recipientAvatar?: string;

  @Field(()=>Int,{nullable:true,defaultValue:0})
  mutualCount?:number

  @Field(() => FriendshipStatus)
  status: FriendshipStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// @ObjectType()
// export class FriendshipEdge {
//   @Field(() => FriendshipType)
//   node: FriendshipType;

//   @Field()
//   cursor: string;
// }

// @ObjectType('FriendshipPageInfo') 
// export class PageInfo {
//   @Field(() => String, { nullable: true })
//   endCursor?: string | null;

//   @Field()
//   hasNextPage: boolean;
// }

// @ObjectType()
// export class FriendshipConnection {
//   @Field(() => [FriendshipEdge])
//   edges: FriendshipEdge[];

//   @Field(() => PageInfo)
//   pageInfo: PageInfo;
// }
