// Cloudinary Configuration for Image Uploads (e.g., parking facility photos)
// Configure CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET in your .env file.

const cloudConfig = {
  cloudName: process.env.CLOUD_NAME || '',
  apiKey: process.env.CLOUD_API_KEY || '',
  apiSecret: process.env.CLOUD_API_SECRET || '',
};

module.exports = cloudConfig;
