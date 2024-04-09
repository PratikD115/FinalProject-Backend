import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Genres } from 'src/song/song-genre.enum';

@InputType()
export class CreateArtistDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

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
