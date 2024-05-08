import { registerEnumType } from '@nestjs/graphql';

export enum Language {
  hindi = 'HINDI',
  punjabi = 'PUNJABI',
  bengali = 'BENGALI',
  tamil = 'TAMIL',
  telugu = 'TELUGU',
  marathi = 'MARATHI',
  gujarati = 'GUJARATI',
  english = 'ENGLISH',
  other = 'OTHER',
}

registerEnumType(Language, {
  name: 'language',
  description: 'Possible language for songs',
});
