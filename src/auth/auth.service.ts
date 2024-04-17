import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createNewUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }

  async login({ email, password }): Promise<{ token: string }> {
    // 1. check if user exists & password is correct

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      // If user does not exist, throw NotFoundException
      throw new NotFoundException('User does not exist');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('please enter the valid creadentials');
    }

    // console.log(this.configService.get<string>('JWT_SECRET'));
    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload);
    return  {token} ;
  }
}
