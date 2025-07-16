import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Post, PostSchema } from './entities/post.schema';
import { PostRepository } from './repositories/post.repository';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Post.name, schema: PostSchema }]),

    CloudinaryModule,
    forwardRef(() => LikeModule),
    UserModule,
  ],
  providers: [PostResolver, PostRepository, PostService],
  exports: [PostService],
})
export class PostModule {}
