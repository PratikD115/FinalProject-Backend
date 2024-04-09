import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SongLanguage } from './song-language.enum';
import { SongMood } from './song-mood.enum';
import { Genres } from './song-genre.enum';

@Schema()
export class Song extends Document {
  @Prop()
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Artist' })
  artist: Types.ObjectId;

  @Prop({ type: [{ type: String, enum: Genres, default: Genres.other }] })
  genres: Genres[];

  @Prop()
  isActive: boolean;

  @Prop()
  duration: number;

  @Prop({ type: String, enum: SongLanguage, default: SongLanguage.other })
  language: SongLanguage;

  @Prop()
  streamingLink: string;

  @Prop()
  imageLink: string;

  @Prop([{ type: String, enum: SongMood, default: SongMood.other }])
  mood: SongMood[];
}

export const songSchema = SchemaFactory.createForClass(Song);
