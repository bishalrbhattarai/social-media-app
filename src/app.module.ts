import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GraphqlModule } from './graphql/graphql.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { EmailModule } from './email/email.module';
import { PostModule } from './post/post.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FriendshipModule } from './friendship/friendship.module';
import { CommentModule } from './comment/comment.module';
import { JobModule } from './job/job.module';
import { LikeModule } from './like/like.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule,
    GraphqlModule,
    DatabaseModule,
    CloudinaryModule,
    UserModule,
    AuthModule,
    EmailModule,
    JobModule,
    PostModule,
    FriendshipModule,
    CommentModule,
    LikeModule,
    ChatModule,
  ],
})
export class AppModule {}
