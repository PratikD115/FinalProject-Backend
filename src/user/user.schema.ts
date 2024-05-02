import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { SongType } from 'src/song/song.type';
import { UserRole } from './user-role.enum';
import { PlaylistType } from 'src/playlist/playlist.type';
import { ArtistType } from 'src/artist/artist.type';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Song' }],
    default: [],
  })
  favourite?: SongType[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Artist' }],
    default: [],
  })
  follow?: ArtistType[];
  
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Playlist' }],
    default: [],
  })
  playlist?: PlaylistType[];

  @Prop(() => UserRole)
  role: UserRole;

  @Prop({ default: '' })
  profile: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Artist',
    default: null,
  })
  artistId?: ArtistType;
}

export const userSchema = SchemaFactory.createForClass(User);
