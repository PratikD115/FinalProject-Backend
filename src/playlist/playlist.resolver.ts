import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PlaylistService } from './playlist.service';
import { PlaylistType } from './playlist.type';
import { Playlist } from './playlist.schema';
import { SongType } from 'src/song/song.type';
import { SongService } from 'src/song/song.service';
import { NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserType } from 'src/user/user.type';

@Resolver(() => PlaylistType)
export class PlaylistResolver {
  constructor(
    private playlistService: PlaylistService,
    private songService: SongService,
    private userService: UserService,
  ) {}

  @Mutation(() => PlaylistType)
  async createNewPlaylist(
    @Args('songId') songId: string,
    @Args('playlistName') playlistName: string,
    @Args('userId') userId: string,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException('user is not exist');
    const playlist = await this.playlistService.createPlaylistAndAddSong(
      songId,
      userId,
      playlistName,
    );
    this.userService.addPlaylistIdToUser(userId, playlist.id);
    return playlist;
  }

  @Mutation(() => PlaylistType)
  async deletePlaylist(@Args('playlistId') playlistId: string) {
    const playlist = await this.playlistService.deletePlaylist(playlistId);
    this.userService.removePlaylistIdToUser(
      playlist.user.toString(),
      playlist.id,
    );
    return playlist;
  }

  @Mutation(() => PlaylistType)
  async addSongToPlaylist(
    @Args('playlistId') playlistId: string,
    @Args('songId') songId: string,
  ) {
    return await this.playlistService.addSongToPlaylist(playlistId, songId);
  }

  @ResolveField(() => [SongType])
  async songs(@Parent() playlist: Playlist) {
    return await this.songService.getSongsByIds(playlist.songs);
  }

  @ResolveField(() => UserType)
  async user(@Parent() playlist: Playlist) {
    return await this.userService.getUserById(playlist.user);
  }
}
