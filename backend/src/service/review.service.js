import ApiError from "../lib/ApiError.js";
import {
  createReview,
  findReviewById,
  findReviewByFilter,
  findOneReview,
  updateReview,
  deleteReview,
} from "../repositories/review.repository.js";

import { findProjectById } from "../repositories/project.repository.js";
import { findContractorById } from "../repositories/contractor.repository.js";

export const createReviewService = async (
  reviewerId,
  reviewData
) => {
  const project = await findProjectById(reviewData.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.status !== "completed") {
    throw new ApiError(
      400,
      "Review can only be submitted after project completion"
    );
  }

  const contractor = await findContractorById(
    reviewData.contractorId
  );

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  const existingReview = await findOneReview({
    projectId: reviewData.projectId,
    reviewerId,
    reviewType: reviewData.reviewType,
  });

  if (existingReview) {
    throw new ApiError(
      409,
      "You have already submitted a review"
    );
  }

  return await createReview({
    ...reviewData,
    reviewerId,
  });
};

export const getReviewByIdService = async (reviewId) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return review;
};

export const getReviewsService = async (filter = {}) => {
  return await findReviewByFilter(filter);
};

export const updateReviewService = async (
  reviewId,
  updateData
) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return await updateReview(reviewId, updateData);
};

export const deleteReviewService = async (reviewId) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await deleteReview(reviewId);

  return {
    message: "Review deleted successfully",
  };
};