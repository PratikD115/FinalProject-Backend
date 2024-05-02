import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createNewUser(name, email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.UserModel.create({
      name,
      email,
      role,
      password: hashedPassword,
      profile : "https://res.cloudinary.com/ddiy656zq/image/upload/v1714641226/user-Image/aprkhw2lucaachvg1ojs.png"
    });
    return user;
  }

  async login({ inputEmail, inputPassword }): Promise<AuthResponse> {
      const user = await this.userService.getUserByEmail(inputEmail);
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const isValid = await bcrypt.compare(inputPassword, user.password);
      if (!isValid) {
        throw new UnauthorizedException('please enter the valid creadentials');
      }

      const payload = { userId: user.id, role: user.role };
      const token = this.jwtService.sign(payload);
      const { id, name, email, role, profile } = user;
      return { token, id, name, email, role, profile };
  }
}
