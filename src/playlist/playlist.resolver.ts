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
import { Song } from 'src/song/song.schema';
import { User } from 'src/user/user.schema';

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
  ): Promise<Playlist> {
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
  async deletePlaylist(
    @Args('playlistId') playlistId: string,
  ): Promise<Playlist> {
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
  ): Promise<Playlist> {
    return await this.playlistService.addSongToPlaylist(playlistId, songId);
  }

  @ResolveField(() => [SongType])
  async songs(@Parent() playlist: Playlist): Promise<Song[]> {
    return await this.songService.getSongsByIds(playlist.songs);
  }

  @ResolveField(() => UserType)
  async user(@Parent() playlist: Playlist): Promise<User> {
    return await this.userService.getUserById(playlist.user);
  }
}
