import { Module, forwardRef } from '@nestjs/common';
import { ArtistResolver } from './artist.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, artistSchema } from './artist.schema';
import { ArtistService } from './artist.service';
import { SongModule } from 'src/song/song.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: artistSchema }]),
    forwardRef(()=> SongModule),
    forwardRef(()=> UserModule),
    CloudinaryModule,
  ],
  providers: [ArtistResolver, ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
