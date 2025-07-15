import { Module } from '@nestjs/common';
import { FriendshipResolver } from './resolvers/friendship.resolver';
import { FriendshipService } from './services/friendship.service';
import { DatabaseModule } from 'src/database/database.module';
import { Friendship, FriendshipSchema } from './entities/friendship.schema';
import { FriendshipRepository } from './repositories/friendship.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
  ],
  providers: [FriendshipResolver, FriendshipService, FriendshipRepository],
})
export class FriendshipModule {}
