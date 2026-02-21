const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  getProperties,
  getNewLaunches,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyPhoto,
  getAllPropertiesAdmin,
} = require('../controllers/propertyController');

// File type filter — accepts images and videos
const fileFilter = (req, file, cb) => {
  const isImage = /^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype);
  const isVideo = /^video\/(mp4|quicktime|webm|x-msvideo|avi|x-matroska)$/.test(file.mimetype);
  if (isImage || isVideo) return cb(null, true);
  cb(new Error('Only image files (JPEG, PNG, WebP) and video files (MP4, MOV, WebM, AVI) are allowed'));
};

// Use Cloudinary storage in production, disk storage in development
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  const { storage: cloudStorage } = require('../config/cloudinary');
  storage = cloudStorage;
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB (covers large videos)
});

const uploadFields = upload.fields([
  { name: 'photos', maxCount: 20 },
  { name: 'floorPlans', maxCount: 10 },
  { name: 'videos', maxCount: 3 },
]);

// Public routes
router.get('/', getProperties);
router.get('/new-launches', getNewLaunches);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

// Admin routes
router.get('/admin/all', protect, getAllPropertiesAdmin);
router.post('/', protect, uploadFields, createProperty);
router.put('/:id', protect, uploadFields, updateProperty);
router.delete('/:id/photo', protect, deletePropertyPhoto);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
