import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './playlist.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel('Playlist') private readonly PlaylistModel: Model<Playlist>,
  ) {}

  async createPlaylistAndAddSong(
    songId,
    userId,
    playlistName,
  ): Promise<Playlist> {
    const newPlaylist = new this.PlaylistModel({
      playlistName,
      user: userId,
      songs: songId,
    });
    console.log(newPlaylist.user);
    return await newPlaylist.save();
  }

  async addSongToPlaylist(
    playlistId: string,
    songId: string,
  ): Promise<Playlist> {
    const playlist = await this.PlaylistModel.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: { songs: songId },
      },
      { new: true },
    );
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }

  async getPlaylistById(playlistId) {
    return await this.PlaylistModel.findById(playlistId);
  }

  async getPlaylistByIds(playlistIds) {
    const playlists: Playlist[] = await Promise.all(
      playlistIds.map(async (playlistId: string) => {
        const Playlist: Playlist = await this.getPlaylistById(playlistId);
        return Playlist;
      }),
    );
    return playlists;
  }
}