import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Genres } from 'src/song/song-genre.enum';
import { Language } from 'src/song/song-language.enum';
import { SongType } from 'src/song/song.type';
import { UserType } from 'src/user/user.type';

@ObjectType('Artist')
export class ArtistType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

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

  @Field(() => [UserType], { nullable: true }) 
  follower?: UserType[];

  @Field()
  biography: string;

  @Field(() => [SongType], { nullable: true })
  songs?: SongType[];
}
