import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ✅ Upload a file to Cloudinary
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto'
    });

    // Clean up local file
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

// ✅ Delete a file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

// ✅ Optional: export cloudinary directly
export default cloudinary;
