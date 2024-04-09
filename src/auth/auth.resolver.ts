import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserType } from 'src/user/user.type';
import { AuthService } from './auth.service';
import { AuthResponse } from './auth.type';
import { CreateUserDto } from 'src/user/dto/create_user.dto';
import { LoginUserDto } from 'src/user/dto/login_user.dto';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserType)
  signUp(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.authService.createNewUser(createUserDto);
  }

  @Mutation(() => AuthResponse)
  login(
    @Args('loginUserDto') loginUserDto: LoginUserDto): Promise<{ token: string }> {
    
    console.log('resolver');
    const token = this.authService.login(loginUserDto);
    return token;
  }
}
