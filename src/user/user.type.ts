import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SongType } from 'src/song/song.type';
import { UserRole } from './user-role.enum';
import { PlaylistType } from 'src/playlist/playlist.type';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => [SongType], { nullable: true }) // Assuming SongType is another GraphQL object representing songs
  favourite?: SongType[];

  @Field(() => [PlaylistType], { nullable: true })
  playlist?: PlaylistType[];

  @Field()
  profile: string;
}
