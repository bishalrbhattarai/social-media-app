import { Injectable, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { configureCloudinary } from './cloudinary.config';
import { ReadStream } from 'fs';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    configureCloudinary(this.configService);
  }

  async uploadStream(file: { createReadStream: () => ReadStream; filename: string }): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'social-app',
          public_id: file.filename.split('.')[0],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      file.createReadStream().pipe(upload);
    });
  }
}
