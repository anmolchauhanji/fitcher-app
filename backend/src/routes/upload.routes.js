import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  uploadAadhar,
  uploadPan,
  uploadPortfolio,
  uploadProjectImages,
  deleteProjectImage,
} from "../controllers/uploader.controller.js";

const router = Router();

/*
| Contractor
|--------------------------------------------------------------------------
*/

router.post(
  "/aadhar",
  authenticate,
  authorize("contractor"),
  upload.single("image"),
  uploadAadhar
);

router.post(
  "/pan",
  authenticate,
  authorize("contractor"),
  upload.single("image"),
  uploadPan
);

router.post(
  "/portfolio",
  authenticate,
  authorize("contractor"),
  upload.array("images", 10),
  uploadPortfolio
);

/*
|--------------------------------------------------------------------------
| Customer
|--------------------------------------------------------------------------
*/

router.post(
  "/project/:projectId",
  authenticate,
  authorize("customer"),
  upload.array("images", 10),
  uploadProjectImages
);

router.delete(
  "/project/:projectId/photo",
  authenticate,
  authorize("customer"),
  deleteProjectImage
);

export default router;