import mongoose from "mongoose";
import { REVIEW_TYPES } from "../constants/review-type.constant.js";

const reviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },

    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviewer ID is required"],
    },

    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: [true, "Contractor ID is required"],
    },

    reviewType: {
      type: String,
      enum: REVIEW_TYPES,
      required: [true, "Review type is required"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "reviews",
  }
);

// One review of a specific type per project by the same reviewer
reviewSchema.index(
  {
    projectId: 1,
    reviewerId: 1,
    reviewType: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;