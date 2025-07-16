import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GqlContext } from 'src/auth/resolvers/auth.resolver';
import { TokenService } from 'src/common/services/token.service';
import { CacheService } from 'src/common/services/cache.service';
import { CommonModule } from 'src/common/common.module';
import { getConfigToken } from '@nestjs/config';

@Module({
  imports: [
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [CommonModule],
      inject: [TokenService, CacheService],
      useFactory: async (tokenService: TokenService, cacheService: CacheService) => ({
        autoSchemaFile: 'schema.gql',
        definitions: {
          path: join(process.cwd(), 'graphql.schema.ts'),
        },
        playground: false,
        plugins:[ApolloServerPluginLandingPageLocalDefault()],
        introspection: true,
        context: ({ req, res, connection }) => {
          // Handle HTTP requests (queries and mutations)
          if (req) {
            return { req, res } as GqlContext;
          }
          // Handle WebSocket connections (subscriptions)
          if (connection) {
            return { 
              connection,
              user: connection.context?.user 
            };
          }
        },
        csrfPrevention: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context) => {
              const { connectionParams } = context;
              console.log('graphql-ws connection attempt:', connectionParams);
              
              try {
                // Extract authorization token
                const authHeader = connectionParams?.authorization || 
                                  connectionParams?.Authorization;
                
                if (!authHeader) {
                  throw new Error('Authorization token is required');
                }

                // Handle both string and other types
                const authHeaderStr = typeof authHeader === 'string' ? authHeader : String(authHeader);
                
                // Remove 'Bearer ' prefix if present
                const token = authHeaderStr.replace('Bearer ', '').trim();
                
                if (!token) {
                  throw new Error('Authorization token is missing');
                }

                // Verify the JWT token
                let payload;
                try {
                  payload = tokenService.verifyAccessToken(token);
                } catch (error) {
                  throw new Error(`Invalid or expired token: ${error.message}`);
                }

                if (!payload) {
                  throw new Error('Invalid token payload');
                }

                // Check if email is verified
                if (!payload.isEmailVerified) {
                  throw new Error('Email is not verified');
                }

                // Check token in cache (same as AuthGuard)
                const cacheValue = await cacheService.get<string>(
                  `access-token:${payload.jti}`,
                );

                if (!cacheValue) {
                  throw new Error('Unauthorized User - Token not in cache');
                }

                if (cacheValue !== token) {
                  throw new Error('Unauthorized User - Token mismatch');
                }

                // Create user object similar to AuthGuard
                const user = { ...payload, _id: payload.sub };
                
                console.log('graphql-ws authenticated successfully:', { 
                  userId: user._id, 
                  email: user.email 
                });
                
                return { 
                  user,
                  isAuthenticated: true 
                };

              } catch (error) {
                console.error('graphql-ws authentication failed:', error.message);
                throw new Error(`Authentication failed: ${error.message}`);
              }
            },
          },
          'subscriptions-transport-ws': {
            onConnect: async (connectionParams) => {
              console.log('subscriptions-transport-ws connection attempt:', connectionParams);
              
              try {
                // Extract authorization token
                const authHeader = connectionParams?.authorization || 
                                  connectionParams?.Authorization;
                
                if (!authHeader) {
                  throw new Error('Authorization token is required');
                }

                // Handle both string and other types
                const authHeaderStr = typeof authHeader === 'string' ? authHeader : String(authHeader);
                
                // Remove 'Bearer ' prefix if present
                const token = authHeaderStr.replace('Bearer ', '').trim();
                
                if (!token) {
                  throw new Error('Authorization token is  missing');
                }

                // Verify the JWT token
                let payload;
                try {
                  payload = tokenService.verifyAccessToken(token);
                } catch (error) {
                  throw new Error(`Invalid or expired token : ${error.message}`);
                }

                if (!payload) {
                  throw new Error('Invalid token payload');
                }

                console.log(`the payload`)
                console.log(payload)

                // Check if email is verified
                if (!payload.isEmailVerified) {
                  throw new Error('Email is not  verified');
                }

                // Check token in cache (same as AuthGuard)
                // const cacheValue = await cacheService.get<string>(
                //   `access-token:${payload.jti}`,
                // );

                // if (!cacheValue) {
                //   throw new Error('Unauthorized User - Token not in cache');
                // }

                // if (cacheValue !== token) {
                //   throw new Error('Unauthorized User - Token mismatch');
                // }

                // Create user object similar to AuthGuard
                const user = { ...payload, _id: payload.sub };
                
                console.log('subscriptions-transport-ws authenticated successfully:', { 
                  userId: user._id, 
                  email: user.email 
                });
                
                return { 
                  user,
                  isAuthenticated: true 
                };

              } catch (error) {
                console.error('subscriptions-transport-ws authentication failed:', error.message);
                throw new Error(`Authentication failed: ${error.message}`);
              }
            },
            onDisconnect: () => {
              console.log('subscriptions-transport-ws disconnected');
            },
          },
        },
        installSubscriptionHandlers: true,
      }),
    }),
  ],
})
export class GraphqlModule {}
