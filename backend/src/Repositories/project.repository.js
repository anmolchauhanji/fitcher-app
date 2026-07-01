import Project from "../models/Project.model.js";

export const createProject = async (projectData) => {
  return await Project.create(projectData);
};

export const findProjectById = async (projectId) => {
  return await Project.findById(projectId);
};

export const findProjectByCustomerId = async (customerId) => {
  return await Project.find({ customerId });
};

export const findProjectByFilter = async (filter = {}) => {
  return await Project.find(filter);
};

export const existsProject = async (projectId) => {
  return await Project.exists({
    _id: projectId,
  });
};

export const countProjects = async (filter = {}) => {
  return await Project.countDocuments(filter);
};

export const updateProjectById = async (
  projectId,
  updateData
) => {
  return await Project.findByIdAndUpdate(
    projectId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};