import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub/pubsub.provider';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class NotificationResolver {
  constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  @Subscription(() => String, {
    filter: (payload, variables) => {
      // Optional: Filter which users should receive the notification
      return payload.userId === variables.userId;
    },
  })
  commentAdded(@Args('userId') userId: string) {
    return this.pubSub.asyncIterator(`commentAdded.${userId}`);
  }

  @Mutation(() => String)
  async triggerCommentNotification(
    @Args('userId') userId: string,
    @Args('message') message: string,
  ) {
    // Publish a notification
    await this.pubSub.publish(`commentAdded.${userId}`, {
      commentAdded: message,
      userId,
    });
    return 'Notification sent!';
  }
}
