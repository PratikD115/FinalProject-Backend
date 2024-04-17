import { Module } from '@nestjs/common';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, songSchema } from './song.schema';
import { ArtistModule } from 'src/artist/artist.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: songSchema }]),
     ArtistModule,
    CloudinaryModule,
  ],
  providers: [SongResolver, SongService],
  exports: [SongService],
})
export class SongModule {}
