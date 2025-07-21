import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendshipService } from '../services/friendship.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/auth/resolvers/auth.resolver';
import { FriendshipConnection } from '../entities/friendship.connection';

import { registerEnumType } from '@nestjs/graphql';
import {
} from '../entities/friendship.entity';

export enum FriendRequestAction {
  ACCEPT = 'accepted',
  DECLINE = 'declined',
}

registerEnumType(FriendRequestAction, {
  name: 'FriendRequestAction',
  description: 'Action to handle a friend request (accept or decline)',
});

@Resolver()
@UseGuards(AuthGuard)
export class FriendshipResolver {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Mutation(() => String)
  async sendFriendRequest(
    @Args('recipient', { type: () => String }) recipient: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.friendshipService.sendFriendRequest(recipient, user);
  }

  @Mutation(() => String)
  async handleFriendRequest(
    @Args('requesterId') requesterId: string,
    @Args('action', { type: () => FriendRequestAction })
    action: FriendRequestAction,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.friendshipService.handleFriendRequest(
      requesterId,
      action,
      user,
    );
  }

  @Mutation(() => String)
  async removeFriend(
    @Args('friendId') friendId: string,
    @CurrentUser() user: User,
  ): Promise<string> {
    return this.friendshipService.removeFriend(friendId, user);
  }

  @Query(() => FriendshipConnection)
  async myFriends(
    @CurrentUser() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { nullable: true }) after?: string,
  ) {
    return this.friendshipService.getFriendsConnection(user, first, after);
  }

  @Query(() => FriendshipConnection)
  async myFriendRequests(
    @CurrentUser() user: User,
    @Args('first', { type: () => Int, nullable: true }) first?: number,
    @Args('after', { nullable: true }) after?: string,
  ) {
    return this.friendshipService.getFriendRequests(user, first, after);
  }
}
