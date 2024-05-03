import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Subscription, subscriptionSchema } from './subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: subscriptionSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [SubscriptionResolver, SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
