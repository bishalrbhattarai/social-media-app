import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../entities/user.schema';
import { CreateUserInput } from 'src/auth/dtos/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findOne({ email });
  }

  async createUser(input: CreateUserInput): Promise<UserDocument> {
    return this.userRepository.create(input);
  }

  async findOneById(_id: string): Promise<UserDocument | null> {
    return this.userRepository.findOne({ _id });
  }

}
