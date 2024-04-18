import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { SongType } from 'src/song/song.type';
import { UserRole } from './user-role.enum';

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

  @Prop(() => UserRole)
  role: UserRole;
}

export const userSchema = SchemaFactory.createForClass(User);
