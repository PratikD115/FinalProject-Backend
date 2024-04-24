import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { SongType } from 'src/song/song.type';
import { UserRole } from './user-role.enum';
import { PlaylistType } from 'src/playlist/playlist.type';

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
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Playlist' }],
    default: [],
  })
  playlist?: PlaylistType[];

  @Prop(() => UserRole)
  role: UserRole;

  @Prop({ default: '' })
  profile: string;
}

export const userSchema = SchemaFactory.createForClass(User);
