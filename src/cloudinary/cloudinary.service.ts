// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAudio(file: FileUpload, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = file.createReadStream();
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: path,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );

      stream.pipe(uploadStream);
    });
  }
  async uploadImage(image: FileUpload, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = image.createReadStream();
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: path,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      );
      stream.pipe(uploadStream);
    });
  }

  async deleteImageByUrl(imageUrl: string): Promise<any> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(
        `Failed to delete image from Cloudinary: ${error.message}`,
      );
    }
  }

  private extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const filename = parts.pop();
    const publicId = filename.split('.')[0];
    return publicId;
  }
}
