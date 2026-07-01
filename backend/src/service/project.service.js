import ApiError from "../lib/ApiError.js";

import {
  createProject,
  findProjectById,
  findProjectByFilter,
  updateProjectById,
} from "../repositories/project.repository.js";

import { findUserById } from "../repositories/user.repository.js";

export const createProjectService = async (
  userId,
  projectData
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "customer") {
    throw new ApiError(
      403,
      "Only customers can create projects"
    );
  }

  return await createProject({
    ...projectData,
    customerId: userId,
  });
};

export const getMyProjectsService = async (userId) => {
  return await findProjectByFilter({
    customerId: userId,
  });
};

export const searchProjectsService = async (
  filters = {}
) => {
  const query = {
    status: "open",
  };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.pincode) {
    query["location.pinCode"] = filters.pincode;
  }

  return await findProjectByFilter(query);
};

export const getProjectByIdService = async (
  projectId
) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

export const updateProjectService = async (
  userId,
  projectId,
  updateData
) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (
    project.customerId.toString() !== userId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to update this project"
    );
  }

  if (project.status !== "open") {
    throw new ApiError(
      400,
      "Only open projects can be updated"
    );
  }

  return await updateProjectById(
    projectId,
    updateData
  );
};

export const closeProjectService = async (
  userId,
  projectId
) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (
    project.customerId.toString() !== userId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not allowed to close this project"
    );
  }

  if (project.status !== "open") {
    throw new ApiError(
      400,
      "Project is already closed"
    );
  }

  return await updateProjectById(
    projectId,
    {
      status: "cancelled",
    }
  );
};