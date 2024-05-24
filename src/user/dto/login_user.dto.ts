import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginUserDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  inputEmail: string;

  @Field()
  @IsNotEmpty()
  @IsString()  
  inputPassword: string;
}
