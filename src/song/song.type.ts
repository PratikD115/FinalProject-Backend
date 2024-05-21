import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Genres } from './song-genre.enum';
import { Language } from './song-language.enum';
import { SongMood } from './song-mood.enum';
import { ArtistType } from 'src/artist/artist.type';

@ObjectType()
export class SongType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => ArtistType)
  artist: ArtistType;

  @Field(() => [Genres])
  genres: Genres[];

  @Field()
  isActive: boolean;
  
  @Field()
  likes: number;

  @Field(() => Language)
  language: Language;

  @Field()
  streamingLink: string;

  @Field()
  imageLink: string;

  @Field(() => [SongMood])
  mood: SongMood[];
}  