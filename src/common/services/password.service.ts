import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
