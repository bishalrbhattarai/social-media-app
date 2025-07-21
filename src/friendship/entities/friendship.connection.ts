import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from 'src/common/pagination/relay.factory';
import { FriendshipType } from './friendship.entity';

@ObjectType()
export class FriendshipConnection extends ConnectionType(FriendshipType,"Friendship") {}
