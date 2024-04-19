import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class LoginUserDto {
  @Field()
  @IsNotEmpty()
  inputEmail: string;

  @Field()
  @IsNotEmpty()
  inputPassword: string;
}
