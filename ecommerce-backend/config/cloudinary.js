// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cấu hình thông tin kết nối Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình nơi lưu trữ (Folder trên Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_products', // Tên thư mục nó sẽ tự tạo trên Cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg'], // Chỉ cho phép up ảnh
  }
});

// 3. Khởi tạo Multer với cấu hình trên
const uploadCloud = multer({ storage });

// 4. Upload avatar (folder riêng, crop vuông)
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_avatars',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'auto' }],
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});


// 5. Upload review media (hỗ trợ ảnh và video)
const reviewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_reviews',
    resource_type: 'auto',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'mp4', 'mov'],
  }
});

const uploadReviewMedia = multer({
  storage: reviewStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

module.exports = uploadCloud;
module.exports.uploadReviewMedia = uploadReviewMedia;
module.exports.uploadAvatar = uploadAvatar;