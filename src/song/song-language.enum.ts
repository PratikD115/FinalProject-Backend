import { registerEnumType } from '@nestjs/graphql';

export enum SongLanguage {
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

registerEnumType(SongLanguage, {
  name: 'SongLangauge',
  description: 'Possible language for songs',
});
