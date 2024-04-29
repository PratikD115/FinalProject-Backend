import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { SongModule } from 'src/song/song.module';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    SongModule,
    JwtModule,
    PlaylistModule,
    ArtistModule,
    CloudinaryModule
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
