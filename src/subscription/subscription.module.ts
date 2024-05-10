import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionService } from './subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Subscription, subscriptionSchema } from './subscription.schema';
import { SubscriptionController } from './subscription.controller';
import { User, userSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: subscriptionSchema },
      { name: User.name, schema: userSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [SubscriptionResolver, SubscriptionService],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
