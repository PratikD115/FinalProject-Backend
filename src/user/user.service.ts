import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserType } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) public readonly UserModel: Model<User>) {}

  async getAllUser(): Promise<User[]> {
    const users = await this.UserModel.find();
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email });
    return user;
  }

  async addToFavourite(userId: string, songId: string) {
    return await this.UserModel.findByIdAndUpdate(userId, {
      $addToSet: { favourite: songId },
    });
  }

  async getUserById(userId: string | UserType) {
    return await this.UserModel.findById(userId);
  }

  async updateUserImage(userId: string, imageLink: string) {
    return this.UserModel.findByIdAndUpdate(
      userId,
      { profile: imageLink },
      { new: true },
    );
  }

  async addIdToPlaylist(userId: string, playlistId: string) {
    const user = await this.UserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { playlist: playlistId } }, // Using $addToSet to add only if not already present
      { new: true }, // Return the updated document
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
  }
}
