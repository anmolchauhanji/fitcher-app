import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  completeContractorProfileSchema,
} from "../validation/contractor.validation.js";

import {
  createContractorProfile,
  getMyContractorProfile,
  updateMyContractorProfile,
  getContractorProfile,
  searchContractors,
  getNearbyContractors,
  getNearbyVerifiedContractors,
  getNearbyContractorsByCategory,
  getTopRatedNearbyContractors,
} from "../controllers/contractor.controller.js";

const router = Router();



router.post(
  "/profile",
  authenticate,
  validate(completeContractorProfileSchema),
  createContractorProfile
);

router.get(
  "/me",
  authenticate,
  getMyContractorProfile
);

router.patch(
  "/me",
  authenticate,
  validate(completeContractorProfileSchema),
  updateMyContractorProfile
);


router.get(
  "/search",
  searchContractors
);

router.get(
  "/nearby",
  authenticate,
  getNearbyContractors
);

router.get(
  "/nearby/verified",
  authenticate,
  getNearbyVerifiedContractors
);

router.get(
  "/nearby/category",
  authenticate,
  getNearbyContractorsByCategory
);

router.get(
  "/nearby/top-rated",
  authenticate,
  getTopRatedNearbyContractors
);

router.get(
  "/:contractorId",
  getContractorProfile
);




export default router;