import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import {
  findContractorByUserId,
  updateContractorById,
} from "../repositories/contractor.repository.js";
// import deleteImage from "../utils/deleteImage.js";
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
          console.error("Cloudinary upload_stream error details:", error);
          return reject(new ApiError(500, `Image upload failed: ${error.message || error}`));
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
    verificationStatus: "pending",
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
    verificationStatus: "pending",
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

  console.log("uploadProjectImagesService validation comparison:", {
    projectCustomerId: project.customerId,
    projectCustomerIdStr: project.customerId.toString(),
    userId: userId,
    userIdStr: userId.toString(),
    match: project.customerId.toString() === userId.toString(),
  });

  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  return await updateProjectById(projectId, {
    $push: {
      photos: {
        $each: images,
      },
    },
  });
};

export const deleteProjectImageService = async (userId, projectId, publicId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  // Remove from Cloudinary
  await deleteImage(publicId);

  // Remove from project photos array
  return await updateProjectById(projectId, {
    $pull: {
      photos: { publicId },
    },
  });
};

export const deleteContractorKycService = async (userId, type) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  if (!['aadhar', 'pan'].includes(type)) {
    throw new ApiError(400, 'Invalid KYC type');
  }

  const doc = contractor.kycDocuments?.[type];
  if (doc?.publicId) {
    await deleteImage(doc.publicId);
  }

  const update = { $unset: {} };
  update.$unset[`kycDocuments.${type}`] = "";

  return await updateContractorById(contractor._id, update);
};
