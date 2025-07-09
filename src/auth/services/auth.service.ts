import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dtos/auth.dto';
import { UserService } from 'src/user/services/user.service';
import { PasswordService } from 'src/common/services/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(input: CreateUserInput) {
    const user = await this.userService.findOneByEmail(input.email);
    if (user) throw new ConflictException('User already exists');
    const password = await this.passwordService.hashPassword(input.password);
  }
}
