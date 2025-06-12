import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; // Your cloudinary v2 instance

// Define the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipe-book-app', // This is the folder name in your Cloudinary account
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // You can add transformations to resize images automatically
    // transformation: [{ width: 800, height: 600, crop: 'limit' }]
  } as any, // The 'as any' can help with some strict TypeScript type issues
});

// Create the multer instance with the configured storage
const upload = multer({ 
  storage: storage,
  // Optional: Add file size limits to prevent very large uploads
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB limit
  }
});

export default upload;