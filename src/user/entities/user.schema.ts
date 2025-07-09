import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Prop()
  bio: string;

  @Prop()
  avatar: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
