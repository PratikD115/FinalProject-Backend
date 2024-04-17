import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Genres } from 'src/song/song-genre.enum';
import { SongType } from 'src/song/song.type';


@ObjectType('Artist')
export class ArtistType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

 
  @Field()
  isActive: boolean;

  @Field()
  imageLink: string;

  @Field()
  dateOfBirth: string;

  @Field()
  nationality: string;

  @Field(() => [Genres])
  genres: Genres[];

  @Field()
  biography: string;

  // Define virtual field for songs
  @Field(() => [SongType], { nullable: true }) // Assuming SongType is another GraphQL object representing songs
  songs?: SongType[];
}