import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop()
  price: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  sessionId: string;

  @Prop()
  planId: string;

  @Prop()
  startDate : Date;

  @Prop()
  expireDate : Date;

  @Prop()
  status: string;
}
export const subscriptionSchema = SchemaFactory.createForClass(Subscription);
