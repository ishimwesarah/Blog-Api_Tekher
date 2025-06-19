import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipe-book-app', 
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // transformation: [{ width: 800, height: 600, crop: 'limit' }]
  } as any, 
});


const upload = multer({ 
  storage: storage,
  
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

export default upload;