import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createProjectSchema,
  updateProjectStatusSchema,
} from "../validation/project.validation.js";

import {
  createProject,
  getMyProjects,
  
  searchProjects,
  getProjectById,
  updateProject,
  closeProject,
  getRecommendedProjects,
   getNearbyProjects,
  getNearbyProjectsByCategory,
  getRecommendedContractors
} from "../controllers/project.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer Project APIs
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  validate(createProjectSchema),
  createProject
);

router.get(
  "/me",
  authenticate,
  getMyProjects
);

router.patch(
  "/:projectId",
  authenticate,
  validate(updateProjectStatusSchema),
  updateProject
);

router.patch(
  "/:projectId/close",
  authenticate,
  closeProject
);

/*
|--------------------------------------------------------------------------
| Public APIs
|--------------------------------------------------------------------------
*/

router.get(
  "/search",
  searchProjects
);

router.get(
  "/recommended",
  authenticate,
  authorize("contractor"),
  getRecommendedProjects
);

router.get(
  "/nearby",
  authenticate,
  authorize("contractor"),
  getNearbyProjects
);

router.get(
  "/nearby/category",
  authenticate,
  authorize("contractor"),
  getNearbyProjectsByCategory
);

router.get(
  "/:projectId",
  getProjectById
);





export default router;