import { Field, ObjectType } from '@nestjs/graphql';



@ObjectType()
export class StripeType {
  @Field()
  price: string;

  @Field()
  userId: string;

  @Field()
  sessionId: string;

  @Field()
  planId: string;
}
