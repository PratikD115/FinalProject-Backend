import { Query } from '@nestjs/graphql';
import { Args, Resolver } from '@nestjs/graphql';
import { Artist } from 'src/artist/artist.schema';
import { ArtistService } from 'src/artist/artist.service';
import { ArtistType } from 'src/artist/artist.type';
import { Song } from 'src/song/song.schema';
import { SongService } from 'src/song/song.service';
import { SongType } from 'src/song/song.type';

@Resolver()
export class SearchResolver {
  constructor(
    private songService: SongService,
    private artistService: ArtistService,
  ) {}

  @Query(() => [SongType])
  async searchSong(@Args('search') search: string): Promise<Song[]> {
    const result = await this.songService.searchSong(search);
    return result;
  }

  @Query(() => [ArtistType])
  async searchArtist(@Args('search') search: string): Promise<Artist[]> {
    const result = await this.artistService.searchArtist(search);
    return result;
  }
}
