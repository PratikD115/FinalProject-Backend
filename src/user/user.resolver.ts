import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from './user.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FavouriteSong } from './dto/add_favourite.dto';
import { SongService } from 'src/song/song.service';
import { SongType } from 'src/song/song.type';
import { User } from './user.schema';
import { PlaylistType } from 'src/playlist/playlist.type';
import { PlaylistService } from 'src/playlist/playlist.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ArtistType } from 'src/artist/artist.type';
import { ArtistService } from 'src/artist/artist.service';
import { SubscriptionType } from 'src/subscription/subscription.type';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private userService: UserService,
    private songService: SongService,
    private playlistService: PlaylistService,
    private cloudinaryService: CloudinaryService,
    private artistService: ArtistService,
    private subscriptionService: SubscriptionService,
  ) {}

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  getuser() {
    try {
      return this.userService.getAllUser();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => [SongType])
  async getFavouriteSongs(@Args('userId') userId: string) {
    try {
      const user = await this.userService.getUserById(userId);
      const songs = await this.songService.getSongsByIds(user.favourite);

      return songs;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => UserType)
  async getUserById(@Args('userId') userId: string) {
    try {
      return await this.userService.getUserById(userId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => UserType)
  async uploadImage(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('userId') userId: string,
  ) {
    let imageLink: string;
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException('user is not exist ');
      }
      imageLink = await this.cloudinaryService.uploadAudio(image, 'user-Image');
      const newUser = await this.userService.updateUserImage(userId, imageLink);
      return newUser;
    } catch (error) {
      if (imageLink) {
        await this.cloudinaryService.deleteImageByUrl(imageLink);
      }
      throw new Error(error);
    }
  }

  @Mutation(() => UserType)
  async addArtistToUser(
    @Args('userId') userId: string,
    @Args('artistId') artistId: string,
  ) {
    return await this.userService.addArtistToUser(userId, artistId);
  }

  @Mutation(() => UserType)
  async removeArtistToUser(
    @Args('userId') userId: string,
    @Args('artistId') artistId: string,
  ) {
    return await this.userService.removeArtistToUser(userId, artistId);
  }

  @Mutation(() => UserType)
  addToFavourite(
    @Args('addSongToFavourite') addSongToFavourite: FavouriteSong,
  ) {
    try {
      return this.userService.addToFavourite(addSongToFavourite);
    } catch (error) {
      throw new Error('failed to add the song in the favourite');
    }
  }

  @Mutation(() => UserType)
  removeToFavourite(
    @Args('removeSongToFavourite') removeSongToFavourite: FavouriteSong,
  ) {
    try {
      return this.userService.removeToFavourite(removeSongToFavourite);
    } catch (error) {
      throw new Error('failed to remove the song in the favourite');
    }
  }

  @ResolveField(() => [SongType])
  async favourite(@Parent() user: User) {
    try {
      return this.songService.getSongsByIds(user.favourite);
    } catch (error) {
      throw new Error('failed to fetch the songs');
    }
  }

  @ResolveField(() => ArtistType)
  async artistId(@Parent() user: User) {
    try {
      return this.artistService.getArtistById(user.artistId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @ResolveField(() => ArtistType)
  async follow(@Parent() user: User) {
    try {
      return this.artistService.getArtistsByIds(user.follow);
    } catch (error) {
      throw new Error(error);
    }
  }

  @ResolveField(() => [PlaylistType])
  async playlist(@Parent() user: User) {
    try {
      return this.playlistService.getPlaylistByIds(user.playlist);
    } catch (error) {
      throw new Error(error);
    }
  }

  @ResolveField(() => SubscriptionType)
  async subscribe(@Parent() user: User) {
    return this.subscriptionService.getSubscriptionById(user.subscribe);
  }
}
