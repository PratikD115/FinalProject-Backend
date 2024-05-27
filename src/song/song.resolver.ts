import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateSongDto } from './dto/createSong.dto';
import { SongService } from './song.service';
import { SongType } from './song.type';
import { Song } from './song.schema';
import { ArtistService } from 'src/artist/artist.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import fetch from 'node-fetch';
import { CreateSongLinkDto } from './dto/createSongLink.dto';
import { Artist } from 'src/artist/artist.schema';

@Resolver(() => SongType)
export class SongResolver {
  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Query(() => SongType)
  async SongById(@Args('id') songId: string): Promise<Song> {
    return this.songService.getSongById(songId);
  }

  @Query(() => [SongType])
  async getAllActiveSongs(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Song[]> {
    const song = await this.songService.getAllActiveSongs(page, limit);
    return song;
  }

  @Query(() => [SongType])
  async songsByLanguage(@Args('language') language: string): Promise<Song[]> {
    return this.songService.findByLanguage(language);
  }

  @Query(() => [SongType])
  async mostLikedSong(): Promise<Song[]> {
    return await this.songService.getMostLikedSong();
  }

  @Mutation(() => String)
  async downloadSong(@Args('url') url: string): Promise<string> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  }

  @Mutation(() => SongType)
  async createSong(
    @Args('createSongDto') createSongDto: CreateSongDto,
    @Args('audio', { type: () => GraphQLUpload })
    audio: FileUpload,
    @Args('image', { type: () => GraphQLUpload })
    image: FileUpload,
  ): Promise<Song> {
    const streamingLink = await this.cloudinaryService.uploadAudio(
      audio,
      'song-audio',
    );
    const imageLink = await this.cloudinaryService.uploadImage(
      image,
      'song-image',
    );

    const savedSong = await this.songService.createSong(
      createSongDto,
      streamingLink,
      imageLink,
    );
    await this.artistService.addSongIdToArtist(savedSong.artist, savedSong.id);
    return savedSong;
  }

  @Mutation(() => SongType)
  async createSongLink(
    @Args('createSongLinkDto') createSongLinkDto: CreateSongLinkDto,
  ): Promise<Song> {
    const { imageLink, streamingLink, ...details } = createSongLinkDto;
    const savedSong = await this.songService.createSong(
      details,
      streamingLink,
      imageLink,
    );

    await this.artistService.addSongIdToArtist(savedSong.artist, savedSong.id);
    return savedSong;
  }

  @Mutation(() => SongType)
  async deleteSong(@Args('id') songId: string): Promise<Song> {
    return await this.songService.softDeleteSong(songId);
  }
  @Mutation(() => SongType)
  async recoverSong(@Args('id') songId: string): Promise<Song> {
    return await this.songService.recoverSong(songId);
  }

  @ResolveField()
  async artist(@Parent() song: Song): Promise<Artist> {
    return this.artistService.getArtistById(song.artist);
  }
}
