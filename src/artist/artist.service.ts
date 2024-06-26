import { Injectable } from '@nestjs/common';
import { Artist } from './artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) public readonly ArtistModel: Model<Artist>,
  ) {}

  async createArtist(artistData, artistImage): Promise<Artist> {
    try {
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
    } catch {
      throw new Error('failed to Create Artist');
    }
  }

  async userToArtist(artistData): Promise<Artist> {
    try {
      const { name, dateOfBirth, biography, genres, language, imageLink } =
        artistData;
      return await this.ArtistModel.create({
        name,
        dateOfBirth,
        biography,
        genres,
        language,
        isActive: true,
        imageLink,
      });
    } catch {
      throw new Error('failed to create the Artist as User');
    }
  }

  async getArtistById(artistId): Promise<Artist> {
    try {
      return await this.ArtistModel.findById(artistId);
    } catch {
      throw new Error('failed to fetch the artist');
    }
  }

  async getAllActiveArtist(): Promise<Artist[]> {
    try {
      return await this.ArtistModel.find({ isActive: true });
    } catch {
      throw new Error('failed to fetch the active artist');
    }
  }

  async addSongIdToArtist(artistId, songId: string): Promise<void> {
    try {
      await this.ArtistModel.findByIdAndUpdate(artistId, {
        $addToSet: { songs: songId },
      });
    } catch {
      throw new Error('failed to add the song in the artist ');
    }
  }

  async getArtistsByIds(artistIds): Promise<Artist[]> {
    try {
      return await Promise.all(
        artistIds.map(async (artistId: string) => {
          const artist: Artist = await this.getArtistById(artistId);
          return artist;
        }),
      );
    } catch {
      throw new Error('failed to fetch the artists');
    }
  }

  async softDeleteArtist(artistId): Promise<Artist> {
    try {
      return await this.ArtistModel.findByIdAndUpdate(artistId, {
        isActive: false,
      });
    } catch {
      throw new Error('failed to soft delete artist');
    }
  }

  async recoverArtist(artistId): Promise<Artist> {
    try {
      return await this.ArtistModel.findByIdAndUpdate(artistId, {
        isActive: true,
      });
    } catch {
      throw new Error('failed to recover the artist');
    }
  }

  async removeSongIdFromArtist(artistId, songId): Promise<void> {
    try {
      await this.ArtistModel.findByIdAndUpdate(artistId, {
        $pull: { songs: songId },
      });
    } catch {
      throw new Error('failed to remove the songid from artist');
    }
  }

  async addUserIdToFollower(userId, artistId): Promise<void> {
    try {
      await this.ArtistModel.findByIdAndUpdate(artistId, {
        $addToSet: { follower: userId },
      });
    } catch {
      throw new Error('failed to add the userId to follower');
    }
  }

  async removeUserIdToFollower(userId, artistId): Promise<void> {
    try {
      await this.ArtistModel.findByIdAndUpdate(artistId, {
        $pull: { follower: userId },
      });
    } catch {
      throw new Error('failed to remove the userId from follower');
    }
  }

  async searchArtist(search: string): Promise<Artist[]> {
    try {
      const regex = new RegExp(search, 'i');
      return await this.ArtistModel.find({ name: regex }).exec();
    } catch {
      throw new Error('failed to search artist');
    }
  }
}
