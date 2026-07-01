import { Router } from "express";

import {
  createReview,
  getReviewById,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", createReview);

router.get("/", getReviews);

router.get("/:reviewId", getReviewById);

router.patch("/:reviewId", updateReview);

router.delete("/:reviewId", deleteReview);

export default router;