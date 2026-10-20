// Cloudinary Configuration for Image Uploads
const cloudConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET || '',
  folder: 'ParkSphere_DEV',
};

module.exports = cloudConfig;
