import { z } from "zod";
import { REVIEW_TYPES } from "../constants/review-type.constant.js";

export const createReviewSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),

  contractorId: z.string().min(1, "Contractor ID is required"),

  reviewType: z.enum([...REVIEW_TYPES]),

  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),

  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5")
    .optional(),

  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional(),
});