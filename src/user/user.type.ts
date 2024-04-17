import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SongType } from 'src/song/song.type';

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

  @Field(() => [SongType], { nullable: true }) // Assuming SongType is another GraphQL object representing songs
  favourite?: SongType[];
}
