import { Injectable } from '@nestjs/common';
import { Artist } from './artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) public readonly ArtistModel: Model<Artist>,
  ) {}
  async createArtist(artistData, artistImage) {
    const { name, dateOfBirth, biography, genres, language } = artistData;

    const artist = await this.ArtistModel.create({
      name,
      dateOfBirth,
      biography,
      genres,
      language,
      isActive: true,
      imageLink: artistImage,
    });
    return artist;
  }

  async getArtistById(id): Promise<Artist> {
    const artist = await this.ArtistModel.findById(id);
    return artist;
  }

  async getAllActiveArtist() {
    const artists = await this.ArtistModel.find({ isActive: true });
    return artists;
  }

  async addSongIdToArtist(artistId, songId: string): Promise<void> {
    await this.ArtistModel.findByIdAndUpdate(artistId, {
      $addToSet: { songs: songId },
    });
  }

  
  async softDeleteArtist(artistId) {
    return await this.ArtistModel.findByIdAndUpdate(artistId, {
      isActive: false,
    });
  }

  async recoverArtist(artistId) {
    return await this.ArtistModel.findByIdAndUpdate(artistId, {
      isActive: true,
    });
  }

  async removeSongIdFromArtist(artistId, songId) {
    await this.ArtistModel.findByIdAndUpdate(artistId, {
      $pull: { songs: songId },
    });
  }

  async searchArtist(search: string): Promise<Artist[]> {
    const regex = new RegExp(search, 'i');
    const artists  = await this.ArtistModel.find({ name: regex }).exec();
    return artists ;
  }
}
