import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValid = argon2.verify(hashedPassword, password);
    if (!isValid) throw new BadRequestException('Invalid credentials');
    return isValid;
  }
}
