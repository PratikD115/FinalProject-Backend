import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Genres } from 'src/song/song-genre.enum';

@InputType()
export class CreateArtistDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
    @IsString()
  dateOfBirth: string;

  @Field()
  @IsString()
  nationality: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field()
  @IsString()
  biography: string;
}
