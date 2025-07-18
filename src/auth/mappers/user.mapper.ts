import { UserType } from 'src/user/entities/user.entity';
import { UserDocument } from 'src/user/entities/user.schema';

export const toUserType = (user: UserDocument): UserType => {
  return {
    id: String(user._id),
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
  };
};
