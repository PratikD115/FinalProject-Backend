import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Genres } from 'src/song/song-genre.enum';
import { Language } from 'src/song/song-language.enum';
import { Song } from 'src/song/song.schema';
import { UserType } from 'src/user/user.type';

@Schema()
export class Artist extends Document {
  @Prop()
  name: string;

  @Prop()
  imageLink: string;

  @Prop()
  isActive: boolean;

  @Prop()
  dateOfBirth: string;

  @Prop({ type: [{ type: String, enum: Genres, default: Genres.other }] })
  genres: Genres[];

  @Prop({ type: String, enum: Language, default: Language.other })
  language: Language;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  follower?: UserType[];

  @Prop()
  biography: string;

  @Prop()
  link: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Song' }],
    default: [],
  })
  songs?: Song[];  
}

export const artistSchema = SchemaFactory.createForClass(Artist);
