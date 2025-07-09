import { Prop, Schema } from '@nestjs/mongoose';

export enum RoleEnum {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

@Schema({ timestamps: true })
export class User {
    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum;

    @Prop()
    bio: string;

    @Prop()
    avatar: string;

    @Prop()
    isEmailVerified: boolean;
}
    