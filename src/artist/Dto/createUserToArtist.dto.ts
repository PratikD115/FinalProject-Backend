import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Genres } from 'src/song/song-genre.enum';
import { Language } from 'src/song/song-language.enum';

@InputType()
export class CreateUserToArtistDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  userId: string;
  
  // @Field()
  // @MinLength(8)
  // password: string;

  @Field()
  @IsString()
  dateOfBirth: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field(() => Language)
  language: Language;

  @Field()
  @IsString()
  biography: string;

  @Field()
  imageLink: string;
}
