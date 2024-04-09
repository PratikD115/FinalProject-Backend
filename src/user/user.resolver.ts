import { Resolver, Query } from '@nestjs/graphql';
import { UserType } from './user.type';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard)
  getuser() {
    return this.userService.getAllUser();
  }
}
