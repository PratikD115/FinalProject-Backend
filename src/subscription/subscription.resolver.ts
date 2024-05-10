import { Body } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { SubscriptionService } from './subscription.service';
import { UserType } from 'src/user/user.type';
import { Subscription } from './subscription.schema';
import { SubscriptionType } from './subscription.type';

@Resolver(() => SubscriptionType)
export class SubscriptionResolver {
  constructor(
    private subscriptionService: SubscriptionService,
    private userService: UserService,
  ) {}

  @Mutation(() => String)
  async createSubscription(
    @Args('price') price: number,
    @Args('userId') userId: string,
  ) {
    const user = await this.userService.getUserById(userId);

    // Call the Stripe service to create a subscription
    const { sessionURL, subscriptionId } =
      await this.subscriptionService.myPaymentServiceStart(user, price);

    const updatedUser = await this.userService.addSubscription(
      userId,
      subscriptionId,
    );
    return sessionURL;
  }
  @Mutation(() => Boolean)
  async StripeWebhook(@Body() event: any) {
    return await this.subscriptionService.handleStripeWebhook(event);
  }

  @ResolveField(() => UserType)
  async userId(@Parent() subscription: Subscription) {
    return await this.userService.getUserById(subscription.userId);
  }
}
