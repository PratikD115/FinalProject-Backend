import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('webhook')
  webhook(@Body() event: any) {
    return this.subscriptionService.handleStripeWebhook(event);
  }
}
