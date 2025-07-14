import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Post, PostSchema } from './entities/post.schema';
import { PostRepository } from './repositories/post.repository';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    UserModule,
    DatabaseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostResolver, PostRepository, PostService],
})
export class PostModule {}
