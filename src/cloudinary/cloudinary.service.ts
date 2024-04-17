// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary with your cloud_name, api_key, and api_secret
    cloudinary.config({
      cloud_name: 'ddiy656zq',
      api_key: '111913981211646',
      api_secret: 'AsFQrasUJpPcQ2our2YoFCJoSjM',
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
  async uploadImage(image: FileUpload, path : string): Promise<any> {
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
}