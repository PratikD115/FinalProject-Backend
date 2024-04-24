import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { SearchModule } from './search/search.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://pratik:pratikd98@mernapp.gm42n80.mongodb.net/',
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
    }),
    AuthModule,
    UserModule,
    ArtistModule,
    SongModule,
    CloudinaryModule,
    SearchModule,
    PlaylistModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Add middleware to handle file uploads
    consumer
      .apply(graphqlUploadExpress())
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
  }
}
