import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dtos/auth.dto';
import { UserService } from 'src/user/services/user.service';
import { PasswordService } from 'src/common/services/password.service';
import { UserDocument } from 'src/user/entities/user.schema';
import { RegisterResponse } from '../response/register-response';
import { UserType } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async register(input: CreateUserInput): Promise<RegisterResponse> {
    const user: UserDocument | null = await this.userService.findOneByEmail(
      input.email,
    );
    if (user) throw new ConflictException('User already exists');
    const password: string = await this.passwordService.hashPassword(
      input.password,
    );

    const createdUser = await this.userService.createUser({
      ...input,
      password,
    });
    return {
      user: createdUser,
      message: 'User created successfully',
    };
  }
}
