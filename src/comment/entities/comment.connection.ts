import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from 'src/common/pagination/relay.factory';
import { CommentType } from './comment.entity';

@ObjectType()
export class CommentConnection extends ConnectionType(CommentType, 'Comment') {}
