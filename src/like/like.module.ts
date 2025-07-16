import { forwardRef, Module } from '@nestjs/common';
import { LikeService } from './services/like.service';
import { LikeResolver } from './resolvers/like.resolver';
import { LikeRepository } from './repositories/like.repository';
import { DatabaseModule } from 'src/database/database.module';
import { Like, LikeSchema } from './entities/like.schema';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    forwardRef(() => PostModule),
    DatabaseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
    ]),
  ],
  providers: [LikeService, LikeResolver, LikeRepository],

  exports: [LikeService],
})
export class LikeModule {}
