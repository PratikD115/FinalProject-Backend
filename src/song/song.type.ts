import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Genres } from './song-genre.enum';
import { SongLanguage } from './song-language.enum';
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
  duration: number;


  @Field()
  isActive: boolean;

  @Field(() => SongLanguage)
  language: SongLanguage;

  @Field()
  streamingLink: string;

  @Field()
  imageLink: string;

  @Field(() => [SongMood])
  mood: SongMood[];
}
