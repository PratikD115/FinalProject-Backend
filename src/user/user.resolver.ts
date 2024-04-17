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
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddSongToFavourite } from './dto/add_favourite.dto';
import { SongService } from 'src/song/song.service';
import { SongType } from 'src/song/song.type';
import { User } from './user.schema';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private userService: UserService,
    private songService: SongService,
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

  @ResolveField(() => [SongType])
  async favourite(@Parent() user: User) {
    return this.songService.getSongsByIds(user.favourite);
  }
}
