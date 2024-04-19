import { Module } from '@nestjs/common';
import { SearchResolver } from './search.resolver';
import { SongModule } from 'src/song/song.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports :[SongModule, ArtistModule],
  providers: [SearchResolver]
})
export class SearchModule {}
