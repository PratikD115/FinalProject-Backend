import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  user = 'USER',
  artist = 'ARTIST',
  admin = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Possible roles for user',
});
