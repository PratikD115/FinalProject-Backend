import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/user/user.type';

@ObjectType()
export class SubscriptionType {
  @Field(() => ID)
  id: string;

  @Field()
  price: string;

  @Field(() => UserType)
  userId: UserType;

  @Field()
  sessionId: string;

  @Field()
  planId: string;

  @Field()
  startDate: Date;

  @Field()
  expireDate: Date;
}
