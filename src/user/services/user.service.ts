import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../entities/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findOne({ email });
  }
}
