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

@Resolver(() => SongType)
export class SongResolver {
  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Query(() => SongType)
  async SongById(@Args('id') songId: string) {
    return this.songService.getSongById(songId);
  }

  @Query(() => [SongType])
  async getAllActiveSongs(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    const song = await this.songService.getAllActiveSongs(page, limit);
    return song;
  }

  @Query(() => [SongType])
  async songsByLanguage(@Args('language') language: string): Promise<Song[]> {
    console.log('in the language resolver ' + language);
    // Call the service method to fetch songs by language
    return this.songService.findByLanguage(language);
  }

  @Mutation(() => String)
  async downloadSong(@Args('url') url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    return base64String;
  }

  @Mutation(() => SongType)
  async createSong(
    @Args('createSongDto') createSongDto: CreateSongDto,
    @Args('audio', { type: () => GraphQLUpload })
    audio: FileUpload,
    @Args('image', { type: () => GraphQLUpload })
    image: FileUpload,
  ) {
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
  ) {
    console.log(createSongLinkDto);
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
  async deleteSong(@Args('id') songId: string) {
    const deletedSong = await this.songService.softDeleteSong(songId);
    return deletedSong;
  }
  @Mutation(() => SongType)
  async recoverSong(@Args('id') songId: string) {
    const song = await this.songService.recoverSong(songId);
    return song;
  }

  @ResolveField()
  async artist(@Parent() song: Song) {
    return this.artistService.getArtistById(song.artist);
  }
}
