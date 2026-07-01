import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createBidSchema,
} from "../validation/bid.validation.js";

import {
  createBid,
  getMyBids,
  getProjectBids,
  acceptBid,
  withdrawBid,
} from "../controllers/bid.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Contractor APIs
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize("contractor"),
  validate(createBidSchema),
  createBid
);

router.get(
  "/me",
  authenticate,
  authorize("contractor"),
  getMyBids
);

router.patch(
  "/:bidId/withdraw",
  authenticate,
  authorize("contractor"),
  withdrawBid
);

/*
|--------------------------------------------------------------------------
| Customer APIs
|--------------------------------------------------------------------------
*/

router.get(
  "/project/:projectId",
  authenticate,
  authorize("customer"),
  getProjectBids
);

router.patch(
  "/:bidId/accept",
  authenticate,
  authorize("customer"),
  acceptBid
);

export default router;