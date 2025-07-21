import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from 'src/common/pagination/relay.factory';
import { PostType } from './post.entity';

@ObjectType()
export class PostConnection extends ConnectionType(PostType, 'Post') {}
