import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SongType } from 'src/song/song.type';
import { UserType } from 'src/user/user.type';
@Schema()
export class Playlist extends Document {
  @Prop()
  playlistName: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: UserType;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Song' }],
    default: [],
  })
  songs?: SongType[];
}

export const playlistSchema = SchemaFactory.createForClass(Playlist);
