import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../user-role.enum';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString({ message: 'please enter a valid user name' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'valid email' })
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string;

  @Field(() => UserRole)
  role: UserRole;
}
