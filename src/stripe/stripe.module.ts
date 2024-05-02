import { Module } from '@nestjs/common';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';
import { UserModule } from 'src/user/user.module';
import { Subscription, stripeSchema } from './stripe.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subscription.name, schema: stripeSchema }]),
    UserModule,
  ],
  providers: [StripeResolver, StripeService],
})
export class StripeModule {}
