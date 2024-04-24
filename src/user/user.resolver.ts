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
import { AddSongToFavourite } from './dto/add_favourite.dto';
import { SongService } from 'src/song/song.service';
import { SongType } from 'src/song/song.type';
import { User } from './user.schema';
import { PlaylistType } from 'src/playlist/playlist.type';
import { PlaylistService } from 'src/playlist/playlist.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private userService: UserService,
    private songService: SongService,
    private playlistService: PlaylistService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  getuser() {
    return this.userService.getAllUser();
  }

  @Mutation(() => UserType)
  addToFavourite(
    @Args('addSongToFavourite') addSongToFavourite: AddSongToFavourite,
  ) {
    const { userId, songId } = addSongToFavourite;
    return this.userService.addToFavourite(userId, songId);
  }

  @Query(() => [SongType])
  async getFavouriteSongs(@Args('userId') userId: string) {
    const user = await this.userService.getUserById(userId);
    const songs = await this.songService.getSongsByIds(user.favourite);
    return songs;
  }

  @Query(() => UserType)
  async getUserById(@Args('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Mutation(() => UserType)
  async uploadImage(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @Args('userId') userId: string,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('user is not exist ');
    }
    const imageLink = await this.cloudinaryService.uploadAudio(
      image,
      'song-audio',
    );
    const newUser = await this.userService.updateUserImage(userId, imageLink);
    return newUser;
  }

  @ResolveField(() => [SongType])
  async favourite(@Parent() user: User) {
    return this.songService.getSongsByIds(user.favourite);
  }

  @ResolveField(() => [PlaylistType])
  async playlist(@Parent() user: User) {
    return this.playlistService.getPlaylistByIds(user.playlist);
  }
}
