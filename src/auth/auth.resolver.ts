import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserType } from 'src/user/user.type';
import { AuthService } from './auth.service';
import { AuthResponse } from './auth.type';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { LoginUserDto } from 'src/user/dto/login_user.dto';
import { UserService } from 'src/user/user.service';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => UserType)
  async signUp(@Args('createUserDto') createUserDto: CreateUserDto) {
    const { name, email, password, role } = createUserDto;
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email id is already exist');
    }
    return await this.authService.createNewUser(name, email, password, role);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginUserDto') loginUserDto: LoginUserDto,
  ): Promise<{ token: string }> {
    const token = await this.authService.login(loginUserDto);

    return  token ;
  }
}
