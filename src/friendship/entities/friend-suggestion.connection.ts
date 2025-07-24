import { ObjectType } from '@nestjs/graphql';
import { ConnectionType } from 'src/common/pagination/relay.factory';
import { FriendSuggestionType } from './friend-suggestion.entity';

@ObjectType()
export class FriendSuggestionConnection extends ConnectionType(
  FriendSuggestionType,
  'FriendSuggestion',
) {}
