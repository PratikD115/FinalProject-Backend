import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './subscription.schema';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { SubscriptionType } from './subscription.type';

@Injectable()
export class SubscriptionService {
  private stripe;
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {
    this.stripe = new Stripe(
      'sk_test_51PBuwgAJIxE0OtQlv14edFnj1KaKpvcQx7VoiJwd3f4cd2o9jRv1b6OUomdvmWh7GKC1rfBplSdRfDavo2hACVjE009jqDePzr',
      {
        apiVersion: '2024-04-10',
      },
    );
  }

  async myPaymentServiceStart(user: any, price: number) :Promise<{ sessionURL: string, subscriptionId: string }>{
    try {
      console.log(user);
      // Define plan IDs for different subscription levels
      const [Basic, Standard, Premium] = [
        'price_1PBuyLAJIxE0OtQlXNfZ0THo',
        'price_1PBuypAJIxE0OtQlATINCC1b',
        'price_1PBuzDAJIxE0OtQldKncu9r0',
      ];

      let planId = null;
      // Determine the plan ID based on the price
      if (price === 3) planId = Basic;
      if (price === 8) planId = Standard;
      if (price === 29) planId = Premium;
   
      if (price !== 0 && user) {
        // Ensure user exists before accessing its properties

        // Create a new payment session with Stripe
        const session = await this.stripe.checkout.sessions.create({
          customer_email: String(user.email),
          client_reference_id: String(user._id), // Ensure _id is converted to string
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: planId,
              quantity: 1,
            },
          ],
          success_url: 'http://localhost:3000',
          cancel_url: 'http://localhost:3000',
        });
        let month;
        if (price === 3) month = 1;
        if (price === 8) month = 3;
        if (price === 29) month = 12;
        const startDate = new Date();

        let expireDate = new Date(startDate);
        expireDate.setMonth(expireDate.getMonth() + month);
        // Create a new subscription and update the user's subscriptions
        const subscription = await this.subscriptionModel.create({
          planId: planId,
          price,
          userId: user.id,
          sessionId: session.url,
          startDate,
          expireDate,
          status: 'complete',
        });
       
        return {sessionURL : session.url , subscriptionId : subscription.id} 
       
      }
    } catch (error) {
      // Catch any errors and throw a NotFoundException
      throw new NotFoundException(error.message);
    }
  }

  async getSubscriptionById(subscribeId: SubscriptionType | string) {
    return await this.subscriptionModel.findById(subscribeId);
  }
  async handleStripeWebhook(
    event: any,
  ): Promise<{ status: string; message?: string }> {
    try {
      console.log('event is ' + event);
      // Handle specific events
      switch (event.type.toString()) {
        case 'checkout.session.completed':
          const paymentIntent = event.data.object;
          console.log(paymentIntent);
          // Handle payment success logic here
          // const currentUser = await this.userModel.findById(
          //   paymentIntent.client_reference_id,
          // );
          // const subscriptionDataStore = await this.subscriptionService.findById(
          //   currentUser.subscriptions,
          // );
          // // Get the current date
          // const currentDate = new Date();

          // // Add month to the current date

          // let futureDate;
          // if (subscriptionDataStore.planType === 'Basic') {
          //   futureDate = new Date(
          //     currentDate.getTime() + 30 * 24 * 60 * 60 * 1000,
          //   );
          // } else if (subscriptionDataStore.planType === 'Standard') {
          //   futureDate = new Date(
          //     currentDate.getTime() + 90 * 24 * 60 * 60 * 1000,
          //   );
          // } else if (subscriptionDataStore.planType === 'Premium') {
          //   futureDate = new Date(
          //     currentDate.getTime() + 361 * 24 * 60 * 60 * 1000,
          //   );
          // }

          // if (subscriptionDataStore) {
          //   const updatedSubscription = {
          //     ...subscriptionDataStore._doc,
          //     planStartDate: paymentIntent.created,
          //     planEndDate: futureDate,
          //     planStatus: paymentIntent.payment_status,
          //   };
          //   await this.subscriptionService.updateSubscription(
          //     currentUser.subscriptions,
          //     updatedSubscription,
          //   );
          // }
          break;
        case 'payment_intent.payment_failed':
          // const failedPaymentIntent = event.data.object;
          // Handle payment failure logic here
          throw new Error('Payment failed');
        // Handle other event types as needed
        default:
          console.log(`Unhandled event type: ${event.type}`);
          break;
      }

      // Return a success response to Stripe
      return { status: 'success' };
    } catch (error) {
      // Catch any errors and log them
      console.log('Webhook signature verification failed.', error);
      // Return an error response
      return {
        status: 'error',
        message: 'Webhook signature verification failed',
      };
    }
  }
}
