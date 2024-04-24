import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SongType } from 'src/song/song.type';
import { UserType } from 'src/user/user.type';

@ObjectType()
export class PlaylistType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType, { nullable: true })
  user: UserType;

  @Field()
  playlistName: string;

  @Field(() => [SongType], { nullable: true }) // Assuming SongType is another GraphQL object representing songs
  songs?: SongType[];
}
