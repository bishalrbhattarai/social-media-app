import { Injectable } from '@nestjs/common';
import { MyFriendRepository } from '../repositories/my-friend.repository';
import { User } from 'src/auth/resolvers/auth.resolver';

@Injectable()
export class MyFriendService {
  constructor(private readonly myFriendRepository: MyFriendRepository) {}

  async addtoFriendsList(id: string, requestedId: string): Promise<void> {
    await this.myFriendRepository.updateOneByFilter(
      {
        userId: id,
      },
      {
        $addToSet: { friends: requestedId },
      },
    );
  }
}
