// song-mood.enum.ts

import { registerEnumType } from '@nestjs/graphql';

export enum SongMood {
  happy = 'HAPPY',
  sad = 'SAD',
  romantic = 'ROMANTIC',
  energetic = 'ENERGETIC',
  peaceful = 'PEACEFUL',
  calm = 'CALM',
  party = 'PARTY',
  love = 'LOVE',
  inspirational = 'INSPIRATIONAL',
  hopefull = 'HOPEFUL',
  exciting = 'EXCITING',
  chill = 'CHILL',  
  anxious = 'ANXIOUS',
  danceable = 'DANCEABLE',
  joyful = 'JOYFULL',
  other = 'OTHER',
}

registerEnumType(SongMood, {
  name: 'SongMood',
  description: 'Possible moods for songs',
});
