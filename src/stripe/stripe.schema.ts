import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop()
  price: string;

  @Prop()
  userId: string;

  @Prop()
  sessionId: string;

  @Prop()
  planId: string;


  // status
  
}
export const stripeSchema = SchemaFactory.createForClass(Subscription);
