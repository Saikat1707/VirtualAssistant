import cloudinaryPkg from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const { v2: cloudinary } = cloudinaryPkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    throw new Error('File path is required');
  }
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    await fs.unlink(filePath);
    console.log(`Uploaded: ${response.secure_url}`);
    return response;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload: ${error.message}`);
  }
};

