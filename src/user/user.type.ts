import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SongType } from 'src/song/song.type';
import { UserRole } from './user-role.enum';
import { PlaylistType } from 'src/playlist/playlist.type';
import { ArtistType } from 'src/artist/artist.type';
import { SubscriptionType } from 'src/subscription/subscription.type';

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

  @Field(() => [SongType], { nullable: true }) 
  favourite?: SongType[];

  @Field(() => [ArtistType], { nullable: true }) 
  follow?: ArtistType[];

  @Field(() => [PlaylistType], { nullable: true })
  playlist?: PlaylistType[];

  @Field()
  profile: string;

  @Field({nullable : true})
  artistId: ArtistType;

  @Field({nullable : true})
  subscribe : SubscriptionType;
}
