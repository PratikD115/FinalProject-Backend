import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

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
}
