import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createReviewService,
  getReviewByIdService,
  getReviewsService,
  updateReviewService,
  deleteReviewService,
} from "../service/review.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    201,
    "Review submitted successfully.",
    review
  );
});

export const getReviewById = asyncHandler(async (req, res) => {
  const review = await getReviewByIdService(
    req.params.reviewId
  );

  return successResponse(
    res,
    200,
    "Review fetched successfully.",
    review
  );
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await getReviewsService(req.query);

  return successResponse(
    res,
    200,
    "Reviews fetched successfully.",
    reviews
  );
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService(
    req.params.reviewId,
    req.body
  );

  return successResponse(
    res,
    200,
    "Review updated successfully.",
    review
  );
});

export const deleteReview = asyncHandler(async (req, res) => {
  const result = await deleteReviewService(
    req.params.reviewId
  );

  return successResponse(
    res,
    200,
    result.message
  );
});