import ApiError from "../lib/ApiError.js";
import {
  createProject,
  findProjectById,
  updateProject,
  deleteProject,
  findProjectByFilter,
} from "../repositories/project.repository.js";

export const createProjectService = async (
  projectData,
  customerId
) => {
  const project = await createProject({
    ...projectData,
    customerId,
  });

  return project;
};

export const getProjectByIdService = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

export const getProjectsService = async (filter = {}) => {
  return await findProjectByFilter(filter);
};

export const updateProjectService = async (
  projectId,
  updateData
) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return await updateProject(projectId, updateData);
};

export const deleteProjectService = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await deleteProject(projectId);

  return {
    message: "Project deleted successfully",
  };
};