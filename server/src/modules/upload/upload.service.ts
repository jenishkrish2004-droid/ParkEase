import multer from 'multer';
import cloudinary from '../../config/cloudinary';
import { AppError } from '../../shared/errors';

// Memory storage for multer (buffer directly to cloudinary)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only images are allowed', 400) as any, false);
    }
  },
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(new AppError('Failed to upload image', 500));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    stream.end(fileBuffer);
  });
};
