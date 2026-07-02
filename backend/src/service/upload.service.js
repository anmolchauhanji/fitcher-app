import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import {
  findContractorByUserId,
  updateContractorById,
} from "../repositories/contractor.repository.js";
import deleteImage from "../utils/deleteImage.js";
import {
  findProjectById,
  updateProjectById,
} from "../repositories/project.repository.js";

import ApiError from "../lib/ApiError.js";
export const uploadImage = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError(500, "Image upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

export const uploadAadharService = async (userId, image) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  if (contractor.kycDocuments?.aadhar?.publicId) {
    await deleteImage(contractor.kycDocuments.aadhar.publicId);
  }

  return await updateContractorById(contractor._id, {
    "kycDocuments.aadhar": image,
  });
};

export const uploadPanService = async (userId, image) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  if (contractor.kycDocuments?.pan?.publicId) {
    await deleteImage(contractor.kycDocuments.pan.publicId);
  }

  return await updateContractorById(contractor._id, {
    "kycDocuments.pan": image,
  });
};

export const uploadPortfolioService = async (userId, images) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  return await updateContractorById(contractor._id, {
    $push: {
      portfolioImages: {
        $each: images,
      },
    },
  });
};

export const uploadProjectImagesService = async (userId, projectId, images) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  return await updateProjectById(projectId, {
    $push: {
      images: [
        {
          url: String,
          publicId: String,
        },
      ],
    },
  });
};
