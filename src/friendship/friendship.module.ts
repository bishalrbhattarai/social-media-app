import { Module } from '@nestjs/common';
import { FriendshipResolver } from './resolvers/friendship.resolver';
import { FriendshipService } from './services/friendship.service';
import { DatabaseModule } from 'src/database/database.module';
import { Friendship, FriendshipSchema } from './entities/friendship.schema';
import { FriendshipRepository } from './repositories/friendship.repository';
import { UserModule } from 'src/user/user.module';
import { MyFriend, MyFriendSchema } from './entities/my-friend.schema';

@Module({
  imports: [
    UserModule,
    DatabaseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
      { name: MyFriend.name, schema: MyFriendSchema },
    ]),
  ],
  providers: [FriendshipResolver, FriendshipService, FriendshipRepository],
})
export class FriendshipModule {}
