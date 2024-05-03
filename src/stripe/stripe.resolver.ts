import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { UserService } from 'src/user/user.service';
import { Body } from '@nestjs/common';

@Resolver()
export class StripeResolver {
  constructor(
    private stripeService: StripeService,
    private userService: UserService,
  ) {}

  @Mutation(() => String)
  async createSubscription(
    @Args('price') price: number,
    @Args('userId') userId: string,
  ) {
    console.log('in the resolver');
    const user = await this.userService.getUserById(userId);

    // Call the Stripe service to create a subscription
    const subscription = await this.stripeService.myPaymentServiceStart(
      user,
      price,
    );
    return subscription;
  }
  @Mutation(() => Boolean)
  async StripeWebhook(@Body() event: any) {
    return await this.stripeService.handleStripeWebhook(event);
  }
}

// async handleStripeWebhook(
//     event: StripeEvent,
//   ): Promise<{ status: string; message?: string }> {
//     try {
//       // Handle specific events
//       switch (event.type.toString()) {
//         case 'checkout.session.completed':
//           const paymentIntent = event.data.object;
//           // Handle payment success logic here
//           const currentUser = await this.userModel.findById(
//             paymentIntent.client_reference_id,
//           );
//           const subscriptionDataStore = await this.subscriptionService.findById(
//             currentUser.subscriptions,
//           );
//           // Get the current date
//           const currentDate = new Date();

//           // Add month to the current date
//           let futureDate;
//           if (subscriptionDataStore.planType === 'Basic') {
//             futureDate = new Date(
//               currentDate.getTime() + 30 * 24 * 60 * 60 * 1000,
//             );
//           } else if (subscriptionDataStore.planType === 'Standard') {
//             futureDate = new Date(
//               currentDate.getTime() + 90 * 24 * 60 * 60 * 1000,
//             );
//           } else if (subscriptionDataStore.planType === 'Premium') {
//             futureDate = new Date(
//               currentDate.getTime() + 361 * 24 * 60 * 60 * 1000,
//             );
//           }

//           if (subscriptionDataStore) {
//             const updatedSubscription = {
//               ...subscriptionDataStore._doc,
//               planStartDate: paymentIntent.created,
//               planEndDate: futureDate,
//               planStatus: paymentIntent.payment_status,
//             };
//             await this.subscriptionService.updateSubscription(
//               currentUser.subscriptions,
//               updatedSubscription,
//             );
//           }
//           break;
//         case 'payment_intent.payment_failed':
//           const failedPaymentIntent = event.data.object;
//           // Handle payment failure logic here
//           throw new Error('Payment failed');
//         // Handle other event types as needed
//         default:
//           console.log(Unhandled event type: ${event.type});
//           break;
//       }

//       // Return a success response to Stripe
//       return { status: 'success' };
//     } catch (error) {
//       // Catch any errors and log them
//       console.log('Webhook signature verification failed.', error);
//       // Return an error response
//       return {
//         status: 'error',
//         message: 'Webhook signature verification failed',
//       };
//     }
//   }

// async myPaymentServiceStart(id: string, price: number): Promise<string> {
//     try {
//       // Find the user by ID and populate the 'subscriptions' field
//       const user = await this.userModel.findById(id).populate('subscriptions');

//       // Define plan IDs for different subscription levels
//       const [Basic, Standard, Premium] = [
//         'price_1P8MuaSFBxjx5nBvtkpuR02W',
//         'price_1P8MuzSFBxjx5nBvTLydzRyf',
//         'price_1P8MvuSFBxjx5nBvnmWS2jW8j',
//       ];

//       let planId = null;
//       // Determine the plan ID based on the price
//       if (price === 1) planId = Basic;
//       if (price === 3) planId = Standard;
//       if (price === 9) planId = Premium;

//       if (price !== 0 && user) {
//         // Ensure user exists before accessing its properties

//         // Create a new payment session with Stripe
//         const session = await this.stripe.checkout.sessions.create({
//           customer_email: String(user.email),
//           client_reference_id: String(user._id), // Ensure _id is converted to string
//           mode: 'subscription',
//           payment_method_types: ['card'],
//           line_items: [
//             {
//               price: planId,
//               quantity: 1,
//             },
//           ],
//           success_url: http://localhost:3000/dashboard/subscriptions,
//           cancel_url: http://localhost:3000/dashboard/subscriptions,
//         });

//         // Create a new subscription and update the user's subscriptions
//         const { _id } = await this.subscriptionService.createSubscription(
//           price,
//           id,
//           session.id,
//           planId,
//         );
//         user.subscriptions = _id;
//         await user.save();

//         return session.url; // Return the URL for the payment session
//       }
//     } catch (error) {
//       // Catch any errors and throw a NotFoundException
//       throw new NotFoundException(error.message);
//     }
//   }
