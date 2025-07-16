import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GqlContext } from 'src/auth/resolvers/auth.resolver';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      definitions: {
        path: join(process.cwd(), 'graphql.schema.ts'),
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }): GqlContext => ({ req, res }),
      csrfPrevention: false,
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            console.log('🔌 WebSocket connected');
          },
        },
      },
    }),
  ],
})
export class GraphqlModule {}
