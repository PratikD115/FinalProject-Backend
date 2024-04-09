import { registerEnumType } from '@nestjs/graphql';

export enum Genres {
  rock = 'ROCK',
  fusion = 'FUSION',
  romantic = 'ROMANTIC',
  pop = 'POP',
  jazz = 'JAZZ',
  classical = 'CLASSICAL',
  hip_hop = 'HIP_HOP',
  electronic = 'ELECTRONIC',
  country = 'COUNTRY',
  blues = 'BLUES',
  indie = 'INDIE',
  folk = 'FOLK',
  rap = 'RAP',
  soul = 'SOUL',
  disco = 'DISCO',
  techno = 'TECHNO',
  chill_out = 'CHILL_OUT',
  sufi = 'SUFI',
  sad = 'SAD',
  other = 'OTHER',
}

registerEnumType(Genres, {
  name: 'Genres',
  description: 'Possible genres for songs',
});
