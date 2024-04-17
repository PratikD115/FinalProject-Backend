import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { SongModule } from 'src/song/song.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    SongModule,
    JwtModule,
  ],
  exports: [UserService],
  providers: [UserResolver, UserService],
})
export class UserModule {}
