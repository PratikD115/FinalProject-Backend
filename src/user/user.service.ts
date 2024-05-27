import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) public readonly UserModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.UserModel.find();

      if (!users) {
        throw new NotFoundException('user is not exist');
      }
      return users;
    } catch (error) {
      throw new Error('failed to fatch the user');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.UserModel.findOne({ email });
    } catch {
      throw new Error('failed to fetch the user by email');
    }
  }

  async addToFavourite({ userId, songId }): Promise<User> {
    try {
      return await this.UserModel.findByIdAndUpdate(userId, {
        $addToSet: { favourite: songId },
      });
    } catch (error) {
      throw new Error('failed to add song to Favourite');
    }
  }

  async removeToFavourite({ userId, songId }): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(userId, {
        $pull: { favourite: songId },
      });

      if (!user) {
        throw new NotFoundException('user is not exist');
      }
      return user;
    } catch (error) {
      throw new Error('failed to add song to Favourite');
    }
  }

  async addSubscription(userId: string, subscriptionId: string): Promise<void> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        userId,
        { subscribe: subscriptionId },
        { new: true },
      );
      if (!user) {
        throw new NotFoundException('user is not exist');
      }
    } catch {
      throw new Error('failed to add subscription to user');
    }
  }

  async addAsArtist(userId: string, artistId: string): Promise<void> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        userId,
        { artistId },
        { new: true },
      );
      if (!user) throw new NotFoundException('user is not exist');
    } catch {
      throw new Error('failed to add artistId to user');
    }
  }
  async addArtistToUser(userId: string, artistId: string): Promise<User> {
    const user = await this.UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { follow: artistId } },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User is not exist');
    }
    return user;
  }
  async removeArtistToUser(userId: string, artistId: string): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        userId,
        { $pull: { follow: artistId } },
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('User is not exist');
      }
      return user;
    } catch {
      throw new Error('failed to remove artistId from user followers');
    }
  }

  async getUserById(userId): Promise<User> {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new NotFoundException('user is not exist');
      }
      return user;
    } catch (error) {
      throw new Error('failed to fetch the user info');
    }
  }

  async updateUserImage(userId: string, imageLink: string): Promise<User> {
    try {
      const updatedUser = await this.UserModel.findByIdAndUpdate(
        userId,
        { profile: imageLink },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User is not exist');
      }

      return updatedUser;
    } catch (error) {
      throw new Error('failed to update user image');
    }
  }

  async addPlaylistIdToUser(userId: string, playlistId: string): Promise<User> {
    try {
      const user = await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { playlist: playlistId } },
        { new: true },
      );

      if (!user) throw new NotFoundException('User is not exist');
      return user;
    } catch {
      throw new Error('failed to add playlistId in user ');
    }
  }
  async removePlaylistIdToUser(
    userId: string,
    playlistId: string,
  ): Promise<User> {
    try {
      const user = await this.UserModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { playlist: playlistId } },
        { new: true },
      );

      if (!user) throw new NotFoundException('User is not exist');
      return user;
    } catch {
      throw new Error('failed to add playlistId in user ');
    }
  }
}
