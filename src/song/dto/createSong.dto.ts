import { Field, ID, InputType } from '@nestjs/graphql';
import { Genres } from '../song-genre.enum';
import { Language } from '../song-language.enum';
import { SongMood } from '../song-mood.enum';
import {  IsString } from 'class-validator';

@InputType()
export class CreateSongDto {
  
  @Field()
  @IsString()
  title: string;

  @Field(() => ID)
  artist: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field(() => Language)
  language: Language;

  @Field(() => [SongMood])
  mood: SongMood[];
}
