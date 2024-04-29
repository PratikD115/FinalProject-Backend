// cloudinary.resolver.ts

import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class CloudinaryResolver {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Mutation(() => String)
  async uploadAudio(
    @Args('file', { type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<string> {
    try {
      const result = await this.cloudinaryService.uploadAudio(file, 'samples');
      return result.secure_url;
    } catch (error) {
      throw new Error('failed to uplaod the image');
    }
  }

  @Mutation(() => Boolean)
  async deleteImage(@Args('imageUrl') imageUrl: string): Promise<boolean> {
    try {
      // Delete the image from Cloudinary
      await this.cloudinaryService.deleteImageByUrl(imageUrl);
      return true; // Image deleted successfully
    } catch (error) {
      console.error(`Failed to delete image: ${error.message}`);
      return false; // Image deletion failed
    }
  }
}
