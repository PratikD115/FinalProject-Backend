import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ArtistType } from './artist.type';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './Dto/create_artist.dto';
import { Artist } from './artist.schema';
import { SongService } from 'src/song/song.service';
import { SongType } from 'src/song/song.type';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Resolver(() => ArtistType)
export class ArtistResolver {
  constructor(
    private artistService: ArtistService,
    private songService: SongService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Query(() => ArtistType)
  async getArtistById(@Args('id') id: string) {
    return await this.artistService.getArtistById(id);
  }
  
  @Query(() => [ArtistType])
  async getAllActiveArtist() {
    return await this.artistService.getAllActiveArtist();
    }
  

  @Mutation(() => ArtistType)
  async createArtist(
    @Args('createArtistDto') createArtistDto: CreateArtistDto,
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
  ) {
    let artist;
    try{
      const artistImage = await this.cloudinaryService.uploadImage(
        image,
        'artist-image',
      );
       artist = this.artistService.createArtist(
        createArtistDto,
        artistImage,
      );
    }
    catch (err) {
      
    }
    return artist;
  }

  @Mutation(() => ArtistType)
  async deleteArtist(@Args('id') artistId: string) {
    const deletedArtist = await this.artistService.softDeleteArtist(artistId);
    await this.songService.softDeleteSongsByIds(deletedArtist.songs);
    return deletedArtist;
  }

  @Mutation(() => ArtistType)
  async recoverArtist(@Args('id') artistId: string) {
    const recoveredArtist = await this.artistService.recoverArtist(artistId);
    await this.songService.recoverSongsByIds(recoveredArtist.songs);
    return recoveredArtist;
  }

  @ResolveField(() => [SongType])
  async songs(@Parent() artist: Artist) {
    return this.songService.findSongByArtistId(artist.id);
  }
}
