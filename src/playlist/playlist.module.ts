import { Module, forwardRef } from '@nestjs/common';
import { PlaylistResolver } from './playlist.resolver';
import { PlaylistService } from './playlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, playlistSchema } from './playlist.schema';
import { UserModule } from 'src/user/user.module';
import { SongModule } from 'src/song/song.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: playlistSchema },
    ]),
    forwardRef(()=> UserModule),
    SongModule,
  ],
  providers: [PlaylistResolver, PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
