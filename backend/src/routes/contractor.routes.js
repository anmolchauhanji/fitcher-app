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
  "/:contractorId",
  getContractorProfile
);

export default router;