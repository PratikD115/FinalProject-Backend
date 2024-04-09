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
    console.log('in the resolver');
    const result = await this.cloudinaryService.uploadAudio(file, "samples");
    return result.secure_url; // or any other relevant field from Cloudinary response
  }
}
