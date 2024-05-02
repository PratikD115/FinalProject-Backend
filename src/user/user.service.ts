import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) public readonly UserModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.UserModel.find();

      if (!users) {
        throw new NotFoundException('user not exist');
      }
      return users;
    } catch (error) {
      throw new Error('failed to fatch the user');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.UserModel.findOne({ email });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addToFavourite({ userId, songId }) {
    try {
      const user = await this.UserModel.findByIdAndUpdate(userId, {
        $addToSet: { favourite: songId },
      });

      if (!user) {
        throw new NotFoundException('user is not exist');
      }
      return user;
    } catch (error) {
      throw new Error('failed to add song to Favourite');
    }
  }

  async addArtistToUser(userId: string, artistId: string) {
    console.log(userId, artistId);
    const user = await this.UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { follow: artistId } },
      {new : true}
      
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async getUserById(userId: string | UserType) {
    try {
      const user = await this.UserModel.findById(userId);
      if (!user) {
        throw new NotFoundException('user not exist!');
      }
      return user;
    } catch (error) {
      throw new Error('failed to fetch the user info');
    }
  }

  async updateUserImage(userId: string, imageLink: string) {
    try {
      const updatedUser = await this.UserModel.findByIdAndUpdate(
        userId,
        { profile: imageLink },
        { new: true },
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user image');
    }
  }

  async addIdToPlaylist(userId: string, playlistId: string) {
    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { playlist: playlistId } }, // Using $addToSet to add only if not already present
      { new: true }, // Return the updated document
    );

    return updatedUser;
  }
}
