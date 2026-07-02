import cloudinary from "../config/cloudinary.js";

const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

export default deleteImage;