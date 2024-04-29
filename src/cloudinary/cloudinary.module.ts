import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryResolver } from './cloudinary.resolver';

@Module({
  providers: [CloudinaryService, CloudinaryResolver],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
