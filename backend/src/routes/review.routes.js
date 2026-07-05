import { Router } from "express";
import authenticate from "../middlewares/auth.middleware.js";

import {
  createReview,
  getReviewById,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", authenticate, createReview);

router.get("/", getReviews);

router.get("/:reviewId", getReviewById);

router.patch("/:reviewId", authenticate, updateReview);

router.delete("/:reviewId", authenticate, deleteReview);

export default router;