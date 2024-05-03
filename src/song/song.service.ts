import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    console.log('in the service ' + language);
    return this.songModel.find({ language });
  }

  async searchSong(search: string): Promise<Song[]> {
    const regex = new RegExp(search, 'i');
    const songs = await this.songModel.find({ title: regex }).exec();
    return songs;
  }

  async getSongById(songId) {
    try {
      const song = await this.songModel.findOne({
        _id: songId,
        isActive: true,
      });
      if (!song) {
        throw new NotFoundException('There is no song with this id');
      }
      return song;
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findSongByArtistId(artistId: string): Promise<Song[]> {
    const songs = await this.songModel.find({ artist: artistId }).exec();
    return songs;
  }

  async softDeleteSong(songId: string) {
    await this.songModel.findByIdAndUpdate(songId, { isActive: false });
    return this.songModel.findById(songId);
  }

  async recoverSong(songId: string) {
    await this.songModel.findByIdAndUpdate(songId, { isActive: true });
    return this.songModel.findById(songId);
  }

  async getAllActiveSongs(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const activeSong = await this.songModel
      .find({ isActive: true })
      .skip(offset)
      .limit(limit);

    return activeSong;
  }

  async softDeleteSongsByIds(songIds) {
    const updatedSongs = await this.songModel
      .updateMany({ _id: { $in: songIds } }, { $set: { isActive: false } })
      .exec();
    return updatedSongs;
  }

  async recoverSongsByIds(songIds) {
    const updatedSongs = await this.songModel
      .updateMany({ _id: { $in: songIds } }, { $set: { isActive: true } })
      .exec();

    return updatedSongs;
  }

  async getSongsByIds(songIds) {
    const songs: Song[] = await Promise.all(
      songIds.map(async (songId: string) => {
        const song: Song = await this.getSongById(songId);
        return song;
      }),
    );
    return songs;
  }
}
