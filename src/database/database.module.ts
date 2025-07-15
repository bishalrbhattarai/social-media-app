import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  InjectConnection,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('DATABASE_URI'),

      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }

  checkStatus() {
    return this.connection.readyState === 1
      ? 'Database connected'
      : 'Database not connected';
  } 

  onModuleInit() {
    console.log(this.checkStatus());
    if (this.connection.readyState !== 1) {
      throw new Error('Database connection failed');
    }
    console.log('DatabaseModule initialized successfully');
  }
}
