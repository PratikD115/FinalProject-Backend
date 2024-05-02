// import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config';
// import { ArtistModule } from './artist/artist.module';
// import { SongModule } from './song/song.module';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { graphqlUploadExpress } from 'graphql-upload';
// import { SearchModule } from './search/search.module';
// import { PlaylistModule } from './playlist/playlist.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     MongooseModule.forRoot(
//       'mongodb+srv://pratik:pratikd98@mernapp.gm42n80.mongodb.net/',
//     ),
//     GraphQLModule.forRoot<ApolloDriverConfig>({
//       driver: ApolloDriver,
//       playground: true,
//       autoSchemaFile: true,
//       useFactory: (config: ConfigService) => {
//         return {
//           // ...
//           formatError: (error) => {
//             const originalError = error.extensions
//               ?.originalError as OriginalError;

//             if (!originalError) {
//               return {
//                 message: error.message,
//                 code: error.extensions?.code,
//               };
//             }
//             return {
//               message: originalError.message,
//               code: error.extensions?.code,
//             };
//           },
//         };
//       },
//     }),
//     AuthModule,
//     UserModule,
//     ArtistModule,
//     SongModule,
//     CloudinaryModule,
//     SearchModule,
//     PlaylistModule,
//   ],
// })
// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(graphqlUploadExpress())
//       .forRoutes({ path: '/graphql', method: RequestMethod.POST });
//   }
// }

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService for factory function
import { graphqlUploadExpress } from 'graphql-upload';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SearchModule } from './search/search.module';
import { PlaylistModule } from './playlist/playlist.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    MongooseModule.forRoot(
      'mongodb+srv://pratik:pratikd98@mernapp.gm42n80.mongodb.net/',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,

      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error?.message,
        };
        return graphQLFormattedError;
      },
    }),
    AuthModule,
    UserModule,
    ArtistModule,
    SongModule,
    CloudinaryModule,
    SearchModule,
    PlaylistModule,
    StripeModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress()) // Apply GraphQL file upload middleware
      .forRoutes({ path: '/graphql', method: RequestMethod.POST }); // Only for POST requests to /graphql
  }
}
