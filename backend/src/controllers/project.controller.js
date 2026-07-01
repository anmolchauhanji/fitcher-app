import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createProjectService,
  getProjectByIdService,
  getMyProjectsService,
  searchProjectsService,
  updateProjectService,
  closeProjectService,
} from "../service/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(
    req.user.id,
    req.body
  );

  return successResponse(
    res,
    201,
    "Project created successfully.",
    project
  );
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await getMyProjectsService(req.user.id);

  return successResponse(
    res,
    200,
    "Projects fetched successfully.",
    projects
  );
});

export const searchProjects = asyncHandler(async (req, res) => {
  const projects = await searchProjectsService(req.query);

  return successResponse(
    res,
    200,
    "Projects fetched successfully.",
    projects
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(
    req.params.projectId
  );

  return successResponse(
    res,
    200,
    "Project fetched successfully.",
    project
  );
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.user.id,
    req.params.projectId,
    req.body
  );

  return successResponse(
    res,
    200,
    "Project updated successfully.",
    project
  );
});

export const closeProject = asyncHandler(async (req, res) => {
  const project = await closeProjectService(
    req.user.id,
    req.params.projectId
  );

  return successResponse(
    res,
    200,
    "Project closed successfully.",
    project
  );
});