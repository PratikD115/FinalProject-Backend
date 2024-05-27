import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './song.schema';
import { CreateSongDto } from './dto/createSong.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectModel(Song.name) private readonly songModel: Model<Song>,
  ) {}

  async createSong(createSongDto: CreateSongDto, result, image): Promise<Song> {
    const { title, artist, mood, language, genres } = createSongDto;
    return await this.songModel.create({
      title,
      artist,
      mood,
      language,
      genres,
      isActive: true,
      streamingLink: result,
      imageLink: image,
    });
  }

  async findByLanguage(language: string): Promise<Song[]> {
    return this.songModel.find({ language });
  }

  async likeIncrement(songId: string) {
    await this.songModel.findByIdAndUpdate(
      songId,
      { $inc: { likes: 1 } },
      { new: true },
    );
  }
  async likeDecrement(songId: string) {
    await this.songModel.findByIdAndUpdate(
      songId,
      { $inc: { likes: -1 } },
      { new: true },
    );
  }

  async getMostLikedSong(): Promise<Song[]> {
    try {
      return await this.songModel.find().sort({ likes: -1 }).limit(7);
    } catch {
      throw new Error('failed to fetch the most liked song');
    }
  }

  async searchSong(search: string): Promise<Song[]> {
    try {
      const regex = new RegExp(search, 'i');
      return await this.songModel.find({ title: regex }).exec();
    } catch {
      throw new Error('failed to search the songs');
    }
  }

  async getSongById(songId): Promise<Song> {
    try {
      const song = await this.songModel.findOne({
        _id: songId,
        isActive: true,
      });
      if (!song) {
        throw new NotFoundException('There is no song with this id');
      }
      return song;
    } catch {
      throw new Error('failed to get the song');
    }
  }

  async findSongByArtistId(artistId: string): Promise<Song[]> {
    try {
      return await this.songModel.find({ artist: artistId });
    } catch {
      throw new Error('failed to find the songs by artistId');
    }
  }

  async softDeleteSong(songId: string): Promise<Song> {
    try {
      await this.songModel.findByIdAndUpdate(songId, { isActive: false });
      return await this.songModel.findById(songId);
    } catch {
      throw new Error('failed to delete the song');
    }
  }

  async recoverSong(songId: string): Promise<Song> {
    try {
      await this.songModel.findByIdAndUpdate(songId, { isActive: true });
      return await this.songModel.findById(songId);
    } catch {
      throw new Error('failed to recover the song');
    }
  }

  async getAllActiveSongs(page: number, limit: number): Promise<Song[]> {
    const offset = (page - 1) * limit;
    try {
      return await this.songModel
        .find({ isActive: true })
        .skip(offset)
        .limit(limit);
    } catch {
      throw new Error('failed to fetch all active songs');
    }
  }

  async softDeleteSongsByIds(songIds) {
    try {
      return await this.songModel.updateMany(
        { _id: { $in: songIds } },
        { $set: { isActive: false } },
      );
    } catch {
      throw new Error('failed to delete the songs by songIds');
    }
  }

  async recoverSongsByIds(songIds) {
    try {
      return await this.songModel.updateMany(
        { _id: { $in: songIds } },
        { $set: { isActive: true } },
      );
    } catch {
      throw new Error('failed to recover the songs by songIds');
    }
  }

  async getSongsByIds(songIds): Promise<Song[]> {
    try {
      return await Promise.all(
        songIds.map(async (songId: string) => {
          const song: Song = await this.getSongById(songId);
          return song;
        }),
      );
    } catch {
      throw new Error('failed to fetch songs by songIds');
    }
  }
}
