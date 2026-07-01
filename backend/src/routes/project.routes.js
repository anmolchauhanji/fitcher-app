import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

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
  "/:projectId",
  getProjectById
);

export default router;