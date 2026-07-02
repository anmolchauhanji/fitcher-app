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
    const categories = Array.isArray(filters.category)
      ? filters.category
      : filters.category.split(",").map((item) => item.trim()).filter(Boolean);

    if (categories.length === 1) {
      query.category = categories[0];
    } else if (categories.length > 1) {
      query.category = { $in: categories };
    }
  }

  if (filters.pincode) {
    const pinCodes = Array.isArray(filters.pincode)
      ? filters.pincode
      : filters.pincode.split(",").map((item) => item.trim()).filter(Boolean);

    if (pinCodes.length === 1) {
      query["location.pinCode"] = pinCodes[0];
    } else if (pinCodes.length > 1) {
      query["location.pinCode"] = { $in: pinCodes };
    }
  }

  if (filters.keyword) {
    const searchValue = filters.keyword.trim();
    if (searchValue) {
      query.$or = [
        { title: { $regex: searchValue, $options: "i" } },
        { description: { $regex: searchValue, $options: "i" } },
        { "location.address": { $regex: searchValue, $options: "i" } },
      ];
    }
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

export const getRecommendedProjectsService = async (
  userId
) => {
  const contractor =
    await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(
      404,
      "Contractor profile not found"
    );
  }

  return await findRecommendedProjects({
    categories:
      contractor.tradeCategories,

    pinCodes:
      contractor.servicePinCodes,
  });
};

