import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Genres } from 'src/song/song-genre.enum';
import { Language } from 'src/song/song-language.enum';
import { SongType } from 'src/song/song.type';

@ObjectType('Artist')
export class ArtistType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Language)
  language: Language;

  @Field()
  isActive: boolean;

  @Field()
  imageLink: string;

  @Field()
  dateOfBirth: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field()
  biography: string;

  @Field(() => [SongType], { nullable: true }) // Assuming SongType is another GraphQL object representing songs
  songs?: SongType[];
}
