import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: {
          expiresIn: '3d', //token expire in 3 day
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    SubscriptionModule,
    ArtistModule
  ],
  providers: [JwtAuthGuard, AuthResolver, AuthService],
  exports : [AuthService]
})
export class AuthModule {}
