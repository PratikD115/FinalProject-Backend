import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './auth.type';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private subscriptionService: SubscriptionService,
  ) {}

  async createNewUser(name, email, password, role): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const profile =
        'https://res.cloudinary.com/ddiy656zq/image/upload/v1716542299/user-Image/zwlfdm20xcfdqbvt32ue.png';
      return await this.userService.UserModel.create({
        name,
        email,
        role,
        password: hashedPassword,
        profile, // default profile imageLink
      });
    } catch {
      throw new Error('failed to create the Signing user account');
    }
  }

  async login({ inputEmail, inputPassword }): Promise<AuthResponse> {
    const user = await this.userService.getUserByEmail(inputEmail);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const isValid = await bcrypt.compare(inputPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Please enter the valid creadentials');
    }
    try {
      const payload = { userId: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      const { id, name, email, role, profile, subscribe, artistId } = user;

      const subscription =
        await this.subscriptionService.getSubscriptionById(subscribe);
      let asArtist;
      if (artistId) {
        asArtist = artistId.toString(); //convert objectiId to string
      }
      return {
        token,
        id,
        name,
        email,
        role,
        profile,
        endDate: subscription?.expireDate,
        asArtist,
      };
    } catch {
      throw new Error('failed to logIn the user');
    }
  }

  async updatePassword(userId: string, password: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.userService.UserModel.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
    } catch {
      throw new Error('failed to update the password');
    }
  }
}
