import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/auth/resolvers/auth.resolver';
import { FriendshipRepository } from '../repositories/friendship.repository';
import {
  FriendshipStatus,
  FriendshipDocument,
} from '../entities/friendship.schema';
import { UserService } from 'src/user/services/user.service';
import { FriendRequestAction } from '../resolvers/friendship.resolver';
import { Types } from 'mongoose';
import { FriendshipType } from '../entities/friendship.entity';
import { FriendshipConnection } from '../entities/friendship.connection';
import { MyFriendService } from './my-friend.service';
import { MyFriendRepository } from '../repositories/my-friend.repository';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly friendshipRepository: FriendshipRepository,
    private readonly myFriendService: MyFriendService,
    private readonly userService: UserService,
    private readonly myFriendRepository: MyFriendRepository,
  ) {}

  async sendFriendRequest(recipientId: string, user: User): Promise<string> {
    if (recipientId === user._id) {
      throw new BadRequestException(
        'You cannot send a friend request to yourself.',
      );
    }

    const [existingForward, existingReverse] = await Promise.all([
      this.friendshipRepository.findOne({
        requester: user._id,
        recipient: recipientId,
      }),
      this.friendshipRepository.findOne({
        requester: recipientId,
        recipient: user._id,
      }),
    ]);

    if (existingForward) {
      await this.handleExisting(
        existingForward,
        user._id,
        recipientId,
        'forward',
      );
    }

    if (existingReverse) {
      await this.handleExisting(
        existingReverse,
        user._id,
        recipientId,
        'reverse',
      );
    }

    const requester = await this.userService.findOneByEmail(user.email);
    if (!requester) throw new BadRequestException('Requester not found.');

    const recipient = await this.userService.findOneById(recipientId);
    if (!recipient)
      throw new BadRequestException(
        `Recipient user with ID: ${recipientId} not found.`,
      );

    await this.friendshipRepository.create({
      requester: user._id,
      requesterName: requester.name,
      requesterAvatar: requester?.avatar,
      recipient: recipientId,
      recipientName: recipient.name,
      recipientAvatar: recipient?.avatar,
      status: FriendshipStatus.Pending,
    });

    return `Friend request sent to user with ID: ${recipientId}`;
  }

  private async handleExisting(
    record: FriendshipDocument,
    requesterId: string,
    recipientId: string,
    direction: 'forward' | 'reverse',
  ): Promise<void> {
    switch (record.status) {
      case FriendshipStatus.Accepted:
        throw new ConflictException(
          `You are already friends with user with ID: ${recipientId}`,
        );

      case FriendshipStatus.Pending:
        if (direction === 'reverse') {
          throw new ConflictException(
            `That user has already sent you a friend request. Accept it instead.`,
          );
        } else {
          throw new ConflictException(
            `Friend request already sent to user with ID: ${recipientId}`,
          );
        }

      case FriendshipStatus.Blocked:
        throw new BadRequestException(
          `You are blocked by user with ID: ${recipientId}`,
        );

      case FriendshipStatus.Declined:
        const deleteFilter =
          direction === 'forward'
            ? { requester: requesterId, recipient: recipientId }
            : { requester: recipientId, recipient: requesterId };

        await this.friendshipRepository.delete(deleteFilter);
        break;
    }
  }

  async handleFriendRequest(
    requesterId: string,
    action: FriendRequestAction,
    currentUser: User,
  ): Promise<string> {
    if (requesterId === currentUser._id)
      throw new BadRequestException(
        'You cannot handle a friend request from yourself.',
      );

    const friendship = await this.friendshipRepository.findOne({
      requester: requesterId,
      recipient: currentUser._id,
    });

    if (!friendship)
      throw new BadRequestException(
        `No pending friend request from user: ${requesterId}`,
      );

    if (friendship.status !== FriendshipStatus.Pending)
      throw new ConflictException(
        `Cannot ${action} a friend request that is currently '${friendship.status}'.`,
      );

    switch (action) {
      case FriendRequestAction.ACCEPT:
        friendship.status = FriendshipStatus.Accepted;
        await friendship.save();

        await this.myFriendService.addtoFriendsList(
          currentUser._id,
          requesterId,
        );
        await this.myFriendService.addtoFriendsList(
          requesterId,
          currentUser._id,
        );
        return `Friend request from ${requesterId} accepted.`;

      case FriendRequestAction.DECLINE:
        friendship.status = FriendshipStatus.Declined;
        await friendship.save();
        return `Friend request from ${requesterId} declined.`;

      default:
        throw new BadRequestException(`Invalid action: ${action}`);
    }
  }

  async removeFriend(friendId: string, currentUser: User): Promise<string> {
    if (friendId === currentUser._id) {
      throw new BadRequestException('You cannot remove yourself.');
    }

    const friendship = await this.friendshipRepository.findOne({
      $or: [
        { requester: currentUser._id, recipient: friendId },
        { requester: friendId, recipient: currentUser._id },
      ],
      status: FriendshipStatus.Accepted,
    });

    if (!friendship) {
      throw new BadRequestException(
        `No friendship found between you and user with ID: ${friendId}`,
      );
    }

    if (friendship.status !== FriendshipStatus.Accepted) {
      throw new ConflictException(
        `Cannot remove a user who is not currently your friend.`,
      );
    }

    // Remove from both users' friends lists
    await this.myFriendService.removeFromFriendsList(currentUser._id, friendId);

    await this.myFriendService.removeFromFriendsList(friendId, currentUser._id);

    await this.friendshipRepository.delete({
      _id: friendship._id,
    });

    return `Friendship with user ${friendId} has been removed.`;
  }

  async getFriendsConnection(
    user: User,
    first = 10,
    after?: string,
  ): Promise<FriendshipConnection> {
    const userId = user._id;

    const baseQuery = {
      $or: [
        { requester: userId, status: FriendshipStatus.Accepted },
        { recipient: userId, status: FriendshipStatus.Accepted },
      ],
    };

    const cursorFilter = after
      ? { _id: { $gt: new Types.ObjectId(after) } }
      : {};

    const query = {
      ...baseQuery,
      ...cursorFilter,
    };

    const limit = first + 1;

    const friendships = await this.friendshipRepository.find(query, {
      first: limit,
      sort: { _id: 1 },
    });

    const hasNextPage = friendships.length > first;

    const slicedFriendships = friendships.slice(0, first);

    const otherUserIds = slicedFriendships.map((f) =>
      f.requester.toString() === userId
        ? f.recipient.toString()
        : f.requester.toString(),
    );

    const currentUserFriendDoc = await this.myFriendRepository.findOne({
      userId: user._id,
    });
    const currentUserFriends: string[] =
      currentUserFriendDoc?.friends.map(String) || [];

    console.log(`Current User Friends:`);
    console.log(currentUserFriends);

    const mutuals = await this.myFriendRepository.aggregate([
      {
        $match: {
          userId: { $in: otherUserIds.map((id) => new Types.ObjectId(id)) },
        },
      },
      {
        $addFields: {
          mutualCount: {
            $size: { $setIntersection: ['$friends', currentUserFriends] },
          },
        },
      },
      {
        $project: {
          userId: 1,
          mutualCount: 1,
        },
      },
    ]);

    const mutualMap = new Map(
      mutuals.map((m) => [m.userId.toString(), m.mutualCount]),
    );

    const edges = slicedFriendships.map((friendship) => {
      const friendId =
        friendship.requester.toString() === userId
          ? friendship.recipient.toString()
          : friendship.requester.toString();

      return {
        node: {
          ...this.mapToFriendshipType(friendship),
          mutualCount: mutualMap.get(friendId) || 0,
        },
        cursor: String(friendship._id),
      };
    });

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    };
  }

  async getFriendRequests(
    user: User,
    first = 10,
    after?: string,
  ): Promise<FriendshipConnection> {
    const userId = user._id;

    const baseQuery = {
      recipient: userId,
      status: FriendshipStatus.Pending,
    };

    const cursorFilter = after
      ? { _id: { $gt: new Types.ObjectId(after) } }
      : {};

    const query = {
      ...baseQuery,
      ...cursorFilter,
    };

    const limit = first + 1;

    const friendships = await this.friendshipRepository.find(query, {
      first: limit,
      sort: { _id: 1 },
    });

    const hasNextPage = friendships.length > first;

    const slicedFriendships = friendships.slice(0, first);

    const edges = slicedFriendships.map((friendship) => {
      return {
        node: {
          ...this.mapToFriendshipType(friendship),
        },
        cursor: String(friendship._id),
      };
    });

    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        endCursor,
        hasNextPage,
      },
    };
  }

  private mapToFriendshipType(friendship: FriendshipDocument): FriendshipType {
    return {
      id: String(friendship._id),
      requester: friendship.requester.toString(),
      requesterName: friendship.requesterName,
      requesterAvatar: friendship.requesterAvatar || '',
      recipient: friendship.recipient.toString(),
      recipientName: friendship.recipientName,
      recipientAvatar: friendship.recipientAvatar || '',
      status: friendship.status,
      createdAt: friendship.createdAt,
      updatedAt: friendship.updatedAt,
    };
  }
}
