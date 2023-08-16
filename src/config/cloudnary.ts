import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// reads the dotenv file
dotenv.config();

// Configuration
cloudinary.config({
  secure: true,
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function cloudinaryUploader(imageData: string) {
  return cloudinary.uploader.upload(imageData, {
    folder: 'PDF-API-USERS',
  });
}

export { cloudinaryUploader, cloudinary };