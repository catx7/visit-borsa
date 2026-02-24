import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly useCloudinary: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME', '');
    this.useCloudinary = !!cloudName && cloudName !== 'placeholder';

    if (this.useCloudinary) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: this.configService.get('CLOUDINARY_API_KEY'),
        api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      });
      this.logger.log('Using Cloudinary for image uploads');
    } else {
      this.logger.warn('Cloudinary not configured — using local file storage');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed');
    }

    if (this.useCloudinary) {
      return this.uploadToCloudinary(file);
    }
    return this.uploadToLocal(file);
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    if (files.length > 8) {
      throw new BadRequestException('Maximum 8 images per upload');
    }
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'pensiuni',
          transformation: [
            { width: 2400, height: 1600, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Upload failed'));
          } else {
            resolve(result);
          }
        },
      );
      upload.end(file.buffer);
    });

    return result.secure_url;
  }

  private async uploadToLocal(file: Express.Multer.File): Promise<string> {
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const ext = extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, file.buffer);

    return `/api/uploads/${filename}`;
  }
}
