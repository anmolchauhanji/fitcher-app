import asyncHandler from "../lib/asyncHandler.js";
import ApiError from "../lib/ApiError.js";
import { successResponse } from "../lib/response.js";

import {
  getNearbyProjectsService,
  getNearbyProjectsByCategoryService,
  createProjectService,
  getProjectByIdService,
  getMyProjectsService,
  searchProjectsService,
  updateProjectService,
  closeProjectService,
  getRecommendedProjectsService,
  getRecommendedContractorsService,
} from "../service/project.service.js";

import { uploadImage, uploadProjectImagesService } from "../service/upload.service.js";

export const createProject = asyncHandler(async (req, res) => {
  // Normalize body when request comes from multipart/form-data (multer)
  const body = { ...req.body };

  // If nested objects were sent as JSON strings (common with FormData), parse them
  try {
    if (body.budget && typeof body.budget === 'string') {
      body.budget = JSON.parse(body.budget);
    }
  } catch (e) {
    // ignore parse errors
  }

  try {
    if (body.location && typeof body.location === 'string') {
      body.location = JSON.parse(body.location);
    }
  } catch (e) {
    // ignore
  }

  // Coerce numeric fields
  try {
    if (body.location && body.location.coordinates && Array.isArray(body.location.coordinates.coordinates)) {
      body.location.coordinates.coordinates = body.location.coordinates.coordinates.map((c) => {
        const num = typeof c === 'string' ? Number(c) : c;
        return Number.isNaN(num) ? c : num;
      });
    }
  } catch (e) {}

  if (body.expiresAt && typeof body.expiresAt === 'string') {
    // keep as ISO string
    body.expiresAt = new Date(body.expiresAt).toISOString();
  }

  // Require at least one image in multipart request
  if (!req.files || !req.files.length) {
    throw new ApiError(400, "At least one project image is required");
  }

  // Create project first
  const project = await createProjectService(req.user._id, body);

  // If images were uploaded in the same multipart request, upload them to Cloudinary
  if (req.files && req.files.length) {
    const images = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, "buildmatch/projects"))
    );

    // Attach uploaded images to project
    await uploadProjectImagesService(req.user._id, project._id, images);

    // Refresh project data
    const refreshed = await getProjectByIdService(project._id);

    return successResponse(res, 201, "Project created successfully.", refreshed);
  }

  return successResponse(res, 201, "Project created successfully.", project);
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await getMyProjectsService(req.user._id);

  return successResponse(res, 200, "Projects fetched successfully.", projects);
});

export const searchProjects = asyncHandler(async (req, res) => {
  const projects = await searchProjectsService(req.query);

  return successResponse(res, 200, "Projects fetched successfully.", projects);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(req.params.projectId);

  return successResponse(res, 200, "Project fetched successfully.", project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.user._id,
    req.params.projectId,
    req.body,
  );

  return successResponse(res, 200, "Project updated successfully.", project);
});

export const closeProject = asyncHandler(async (req, res) => {
  const project = await closeProjectService(req.user._id, req.params.projectId);

  return successResponse(res, 200, "Project closed successfully.", project);
});

export const getRecommendedProjects = asyncHandler(async (req, res) => {
  const projects = await getRecommendedProjectsService(req.user.id);

  return successResponse(
    res,
    200,
    "Recommended projects fetched successfully.",
    projects,
  );
});

export const getNearbyProjects = asyncHandler(async (req, res) => {
  const projects = await getNearbyProjectsService(req.query);

  return successResponse(
    res,
    200,
    "Nearby projects fetched successfully.",
    projects,
  );
});

export const getNearbyProjectsByCategory = asyncHandler(async (req, res) => {
  const projects = await getNearbyProjectsByCategoryService(req.query);

  return successResponse(
    res,
    200,
    "Nearby projects fetched successfully.",
    projects,
  );
});


export const getRecommendedContractors =
  asyncHandler(async (req, res) => {
    const contractors =
      await getRecommendedContractorsService(
        req.params.projectId
      );

    return successResponse(
      res,
      200,
      "Recommended contractors fetched successfully.",
      contractors
    );
  });