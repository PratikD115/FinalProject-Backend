import { ObjectType, Field } from '@nestjs/graphql';
import { ArtistType } from 'src/artist/artist.type';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  email: string;

  @Field()
  profile: string;

  @Field({nullable : true})
  endDate: Date;

  @Field({ nullable: true })
  asArtist?: string;
}
