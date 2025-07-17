import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum FriendshipStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
  Blocked = 'blocked',
}

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  requester: string;

  @Prop({ required: true })
  requesterName: string;

  @Prop({required:false,default:""})
  requesterAvatar?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: string;

  @Prop({ required: true })
  recipientName: string;

  @Prop({required:false,default:""})
  recipientAvatar?: string;

  @Prop({
    type: String,
    enum: Object.values(FriendshipStatus),
    default: FriendshipStatus.Pending,
  })
  status: FriendshipStatus;
}
export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
export type FriendshipDocument = Friendship &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

FriendshipSchema.index({ requester: 1 });
FriendshipSchema.index({ recipient: 1 });
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
