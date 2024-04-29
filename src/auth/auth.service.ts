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
    });
    return user;
  }

  async login({ inputEmail, inputPassword }) :Promise<AuthResponse> {
    // 1. check if user exists & password is correct

    const user = await this.userService.getUserByEmail(inputEmail);
    if (!user) {
      // If user does not exist, throw NotFoundException
      throw new NotFoundException('User does not exist');
    }
    const isValid = await bcrypt.compare(inputPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('please enter the valid creadentials');
    }

    // console.log(this.configService.get<string>('JWT_SECRET'));
    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload);
    const { id, name, email, role, profile } = user;
    return { token, id, name, email, role, profile };
  }
}
