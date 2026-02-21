const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Single storage handles both images and videos — resource_type is set dynamically
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'demohomes-v1/videos' : 'demohomes-v1',
      resource_type: isVideo ? 'video' : 'image',
      ...(isVideo
        ? { allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'] }
        : {
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          }),
    };
  },
});

/**
 * Extract Cloudinary public_id from a URL so we can delete it.
 * URL: https://res.cloudinary.com/cloud/image/upload/v123/folder/file.jpg
 * public_id: folder/file
 */
const getPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
};

const deleteFile = async (url) => {
  try {
    const publicId = getPublicId(url);
    if (publicId) {
      const isVideo = url.includes('/video/upload/');
      await cloudinary.uploader.destroy(publicId, {
        resource_type: isVideo ? 'video' : 'image',
      });
    }
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { cloudinary, storage, deleteFile };
