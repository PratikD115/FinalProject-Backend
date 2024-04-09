import { Field, ID, InputType } from '@nestjs/graphql';
import { Genres } from '../song-genre.enum';
import { SongLanguage } from '../song-language.enum';
import { SongMood } from '../song-mood.enum';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateSongDto {
  @Field()
  @IsString()
  title: string;

  @Field(() => ID)
  artist: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field()
  @IsNumber()
  duration: number;

  @Field(() => SongLanguage)
  language: SongLanguage;

  @Field(() => [SongMood])
  mood: SongMood[];
}
