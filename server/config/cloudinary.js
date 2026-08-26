import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', 'uploads');

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'local_placeholder' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'local_placeholder' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'local_placeholder';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadMedia(fileBuffer, filename, mimeType, folder = 'elisadecor') {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              size: result.bytes,
              mimeType: mimeType,
            });
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } else {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${cleanFilename}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    fs.writeFileSync(filePath, fileBuffer);
    const url = `/uploads/${uniqueName}`;

    return {
      url: url,
      publicId: `local-${uniqueName}`,
      width: 800,
      height: 600,
      size: fileBuffer.length,
      mimeType: mimeType,
    };
  }
}

export async function deleteMedia(publicId) {
  if (publicId.startsWith('local-')) {
    const localName = publicId.replace('local-', '');
    const filePath = path.join(uploadDir, localName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { result: 'ok' };
  }

  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  return { result: 'ok' };
}

export { isCloudinaryConfigured };
