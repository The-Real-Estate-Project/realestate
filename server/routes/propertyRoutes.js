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

// File type filter (used for both storage modes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'));
  }
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const uploadFields = upload.fields([
  { name: 'photos', maxCount: 20 },
  { name: 'floorPlans', maxCount: 10 },
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
