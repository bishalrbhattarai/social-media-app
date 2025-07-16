import { Global, Module } from '@nestjs/common';
import { PubSubProvider } from './pubsub.provider';

@Global() // 👈 makes it available everywhere without re-import
@Module({
  providers: [PubSubProvider],
  exports: [PubSubProvider],
})
export class PubSubModule {}
