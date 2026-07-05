import ApiError from "../lib/ApiError.js";

import {
  createProject,
  findProjectById,
  findProjectByFilter,
  updateProjectById,
  findNearbyProjects,
  findNearbyProjectsByCategory,
  findRecommendedProjects,
  
} from "../repositories/project.repository.js";
import { createNotificationService } from "./notification.service.js";
import { findContractorByUserId ,findNearbyVerifiedContractorsByCategory} from "../repositories/contractor.repository.js";
import { findUserById } from "../repositories/user.repository.js";

export const createProjectService = async (userId, projectData) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "customer") {
    throw new ApiError(403, "Only customers can create projects");
  }

  const { location } = projectData;

  if (!location || !location.coordinates || !location.coordinates.coordinates) {
    throw new ApiError(400, "Project location is required.");
  }

  const [longitude, latitude] = location.coordinates.coordinates;

  if (typeof longitude !== "number" || typeof latitude !== "number") {
    throw new ApiError(400, "Invalid location coordinates.");
  }

  const savedProject = await createProject({
  ...projectData,
  customerId: userId,
  location: {
    address: location.address,
    city: location.city,
    state: location.state,
    pinCode: location.pinCode,
    coordinates: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  },
});

const recommendedContractors =
  await findNearbyVerifiedContractorsByCategory(
    longitude,
    latitude,
    savedProject.category
  );

for (const contractor of recommendedContractors) {
  await createNotificationService({
    receiverId: contractor.userId,
    senderId: userId,
    type: "NEW_PROJECT",
    title: "New Project Near You",
    message: `${savedProject.title} has been posted near your service area.`,
    data: {
      projectId: savedProject._id,
    },
  });
}

// Create notification for the customer who created the project
await createNotificationService({
  receiverId: userId,
  senderId: userId,
  type: "PROJECT_CREATED",
  title: "Project Published Successfully",
  message: `Your project "${savedProject.title}" has been successfully published and is now open for bidding.`,
  data: {
    projectId: savedProject._id,
  },
});

return savedProject;
  
};

export const getMyProjectsService = async (userId) => {
  return await findProjectByFilter({
    customerId: userId,
  });
};

export const searchProjectsService = async (filters = {}) => {
  const query = {
    status: "open",
  };

  if (filters.category) {
    const categories = Array.isArray(filters.category)
      ? filters.category
      : filters.category
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    if (categories.length === 1) {
      query.category = categories[0];
    } else if (categories.length > 1) {
      query.category = { $in: categories };
    }
  }

  if (filters.pincode) {
    const pinCodes = Array.isArray(filters.pincode)
      ? filters.pincode
      : filters.pincode
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

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

export const getProjectByIdService = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await project.populate("customerId", "name email");

  return project;
};

export const updateProjectService = async (userId, projectId, updateData) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this project");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Only open projects can be updated");
  }

  return await updateProjectById(projectId, updateData);
};

export const closeProjectService = async (userId, projectId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to close this project");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Project is already closed");
  }

  return await updateProjectById(projectId, {
    status: "cancelled",
  });
};

export const getRecommendedContractorsService =
  async (projectId) => {
    const project =
      await findProjectById(projectId);

    if (!project) {
      throw new ApiError(
        404,
        "Project not found."
      );
    }

    const [
      longitude,
      latitude,
    ] =
      project.location.coordinates.coordinates;

    return await findNearbyVerifiedContractorsByCategory(
      longitude,
      latitude,
      project.category
    );
  };

export const getRecommendedProjectsService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const recommendedProjects = await findRecommendedProjects({
    categories: [],
    pinCodes: [],
  });

  if (recommendedProjects.length > 0) {
    return recommendedProjects;
  }

  return await findProjectByFilter({
    status: "open",
  });
};

export const getNearbyProjectsService = async ({
  longitude,
  latitude,
  radius = 20,
}) => {
  if (longitude === undefined || latitude === undefined) {
    throw new ApiError(400, "Longitude and latitude are required.");
  }

  return await findNearbyProjects(
    Number(longitude),
    Number(latitude),
    Number(radius),
  );
};

export const getNearbyProjectsByCategoryService = async ({
  longitude,
  latitude,
  category,
  radius = 20,
}) => {
  if (!category) {
    throw new ApiError(400, "Category is required.");
  }

  return await findNearbyProjectsByCategory(
    Number(longitude),
    Number(latitude),
    category,
    Number(radius),
  );
};


