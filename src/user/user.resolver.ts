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
import { Song } from 'src/song/song.schema';
import { Artist } from 'src/artist/artist.schema';
import { Playlist } from 'src/playlist/playlist.schema';
import { Subscription } from 'src/subscription/subscription.schema';
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
  getuser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Query(() => [SongType])
  async getFavouriteSongs(@Args('userId') userId: string): Promise<Song[]> {
    if (!userId) throw new NotFoundException('please enter userId');
    const user = await this.userService.getUserById(userId);
    return await this.songService.getSongsByIds(user.favourite);
  }

  @Query(() => UserType)
  async getUserById(@Args('userId') userId: string): Promise<User> {
    if (!userId) throw new NotFoundException('please enter userId');
    return await this.userService.getUserById(userId);
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
  async storeImageLink(
    @Args('imageLink') imageLink: string,
    @Args('userId') userId: string,
  ): Promise<User> {
    return await this.userService.updateUserImage(userId, imageLink);
  }

  @Mutation(() => UserType)
  async addArtistToUser(
    @Args('userId') userId: string,
    @Args('artistId') artistId: string,
  ): Promise<User> {
    await this.artistService.addUserIdToFollower(userId, artistId);
    return await this.userService.addArtistToUser(userId, artistId);
  }

  @Mutation(() => UserType)
  async removeArtistToUser(
    @Args('userId') userId: string,
    @Args('artistId') artistId: string,
  ): Promise<User> {
    await this.artistService.removeUserIdToFollower(userId, artistId);
    return await this.userService.removeArtistToUser(userId, artistId);
  }

  @Mutation(() => UserType)
  addToFavourite(
    @Args('addSongToFavourite') addSongToFavourite: FavouriteSong,
  ): Promise<User> {
    this.songService.likeIncrement(addSongToFavourite.songId);
    return this.userService.addToFavourite(addSongToFavourite);
  }

  @Mutation(() => UserType)
  removeToFavourite(
    @Args('removeSongToFavourite') removeSongToFavourite: FavouriteSong,
  ): Promise<User> {
    this.songService.likeDecrement(removeSongToFavourite.songId);
    return this.userService.removeToFavourite(removeSongToFavourite);
  }

  @ResolveField(() => [SongType])
  async favourite(@Parent() user: User): Promise<Song[]> {
    return this.songService.getSongsByIds(user.favourite);
  }

  @ResolveField(() => ArtistType)
  async artistId(@Parent() user: User): Promise<Artist> {
    try {
      return this.artistService.getArtistById(user.artistId);
    } catch (error) {
      throw new Error(error);
    }
  }

  @ResolveField(() => ArtistType)
  async follow(@Parent() user: User): Promise<Artist[]> {
    try {
      return await this.artistService.getArtistsByIds(user.follow);
    } catch (error) {
      throw new Error(error);
    }
  }

  @ResolveField(() => [PlaylistType])
  async playlist(@Parent() user: User): Promise<Playlist[]> {
    return this.playlistService.getPlaylistByIds(user.playlist);
  }

  @ResolveField(() => SubscriptionType)
  async subscribe(@Parent() user: User): Promise<Subscription> {
    return this.subscriptionService.getSubscriptionById(user.subscribe);
  }
}
