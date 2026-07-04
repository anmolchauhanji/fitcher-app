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

export const updateProjectById = async (projectId, updateData) => {
  return await Project.findByIdAndUpdate(projectId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const findRecommendedProjects = async ({ categories, pinCodes }) => {
  return await Project.find({
    status: "open",

    category: {
      $in: categories,
    },

    "location.pinCode": {
      $in: pinCodes,
    },
  }).sort({
    createdAt: -1,
  });
};

export const closeProjectById = async (projectId) => {
  return await Project.findByIdAndUpdate(
    projectId,
    {
      status: "completed",
      completedAt: new Date(),
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
};

export const findNearbyProjects = async (
  longitude,
  latitude,
  radiusInKm = 20
) => {
  return await Project.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        },

        distanceField: "distance",

        maxDistance:
          radiusInKm * 1000,

        spherical: true,

        query: {
          status: "open",
        },
      },
    },
  ]);
};
export const findNearbyProjectsByCategory =
  async (
    longitude,
    latitude,
    category,
    radiusInKm = 20
  ) => {
    return await Project.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              longitude,
              latitude,
            ],
          },

          distanceField: "distance",

          maxDistance:
            radiusInKm * 1000,

          spherical: true,

          query: {
            status: "open",
            category,
          },
        },
      },
    ]);
  };

export const findProjectsWithinRadius = async (
  longitude,
  latitude,
  radiusInKm,
) => {
  return await Project.find({
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },

        $maxDistance: radiusInKm * 1000,
      },
    },
  });
};
