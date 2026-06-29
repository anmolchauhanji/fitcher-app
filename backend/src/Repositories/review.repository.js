import Review from "../models/Review.model.js";

export const createReview = async (reviewData) => {
  return await Review.create(reviewData);
};

export const findReviewById = async (reviewId) => {
  return await Review.findById(reviewId);
};

export const findReviewByFilter = async (filter = {}) => {
  return await Review.find(filter);
};

export const findOneReview = async (filter = {}) => {
  return await Review.findOne(filter);
};

export const existsReview = async (filter = {}) => {
  return await Review.exists(filter);
};

export const countReviews = async (filter = {}) => {
  return await Review.countDocuments(filter);
};

export const updateReview = async (reviewId, updateData) => {
  return await Review.findByIdAndUpdate(
    reviewId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteReview = async (reviewId) => {
  return await Review.findByIdAndDelete(reviewId);
};