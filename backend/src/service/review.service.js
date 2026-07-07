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
import { findContractorById, updateContractorById } from "../repositories/contractor.repository.js";
import Review from "../models/Review.model.js";

const syncContractorAverageRating = async (contractorId) => {
  const reviews = await Review.find({ contractorId }).select("rating");
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0;

  await updateContractorById(contractorId, { averageRating });
};

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

  const review = await createReview({
    ...reviewData,
    reviewerId,
  });

  await syncContractorAverageRating(review.contractorId);

  return review;
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

  const updatedReview = await updateReview(reviewId, updateData);
  await syncContractorAverageRating(updatedReview.contractorId);

  return updatedReview;
};

export const deleteReviewService = async (reviewId) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await deleteReview(reviewId);
  await syncContractorAverageRating(review.contractorId);

  return {
    message: "Review deleted successfully",
  };
};