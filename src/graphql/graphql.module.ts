import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, UnauthorizedException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GqlContext } from 'src/auth/resolvers/auth.resolver';
import { TokenService } from 'src/common/services/token.service';
import { CacheService } from 'src/common/services/cache.service';
import { CommonModule } from 'src/common/common.module';

interface CustomExtra extends Record<string, any> {
  user?: any;
  isAuthenticated?: boolean;
}

@Module({
  imports: [
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [CommonModule],
      inject: [TokenService, CacheService],
      useFactory: async (
        tokenService: TokenService,
        cacheService: CacheService,
      ) => ({
        autoSchemaFile: 'schema.gql',
        definitions: {
          path: join(process.cwd(), 'graphql.schema.ts'),
        },
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        introspection: true,

        subscriptions: {
          'graphql-ws': {
            onConnect: async (context) => {
              const { connectionParams, extra } = context;
              const customExtra = extra as CustomExtra;
              console.log('graphql-ws connection attempt:', connectionParams);

              try {
                const authHeader =
                  connectionParams?.authorization ||
                  connectionParams?.Authorization;

                if (!authHeader)
                  throw new UnauthorizedException(
                    'Authorization header is missing',
                  );

                const authHeaderStr =
                  typeof authHeader === 'string'
                    ? authHeader
                    : String(authHeader);

                const token = authHeaderStr.replace('Bearer ', '').trim();

                if (!token)
                  throw new UnauthorizedException(
                    'Token is missing from the authorization header',
                  );

                let payload: any;
                try {
                  payload = tokenService.verifyAccessToken(token);
                } catch (error) {
                  console.error('Token verification failed:', error.message);
                  throw new UnauthorizedException('Invalid or expired token');
                }

                if (!payload)
                  throw new UnauthorizedException('Invalid token payload');

                if (!payload.isEmailVerified)
                  throw new UnauthorizedException('Email is not verified');

                // const cacheValue = await cacheService.get<string>(
                //   `access-token:${payload.jti}`,
                // );

                // if (!cacheValue) {
                //   throw new Error('Unauthorized User - Token not in cache');
                // }

                // if (cacheValue !== token) {
                //   throw new Error('Unauthorized User - Token mismatch');
                // }

                const user = { email:payload.email, _id: payload.sub,isEmailVerfied: payload.isEmailVerified };

                // console.log('graphql-ws authenticated successfully:', {
                //   userId: user._id,
                //   email: user.email,
                // });

                customExtra.user = user;

              } catch (error) {
                console.error(
                  'graphql-ws authentication failed:',
                  error.message,
                );
                throw new UnauthorizedException(
                  'Authentication failed: ' + error.message,
                );
              }
            },
          },
        },

        context: ({ req, res,  extra }) => {

          if (req) {
            return { req, res } as GqlContext;
          }

          return {
            extra: {
              user: extra.user,
            } as CustomExtra,
          }
    
        },
        csrfPrevention: false,
      }),
    }),
  ],
})
export class GraphqlModule {}
