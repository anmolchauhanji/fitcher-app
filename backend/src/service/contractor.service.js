import ApiError from "../lib/ApiError.js";

import {
  createContractor,
  findContractorById,
  findContractorByUserId,
  findContractorByFilter,
  updateContractorById,
  findNearbyContractors,
  findNearbyVerifiedContractors,
  findNearbyContractorsByCategory,
  findTopRatedNearbyContractors,
} from "../repositories/contractor.repository.js";

import {
  findUserById,
  updateUserById,
} from "../repositories/user.repository.js";

export const createContractorProfileService = async (
  userId,
  contractorData,
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingContractor = await findContractorByUserId(userId);

  if (existingContractor) {
    throw new ApiError(409, "Contractor profile already exists");
  }

  const contractor = await createContractor({
    userId,
    ...contractorData,
  });

  await updateUserById(userId, {
    role: "contractor",
  });

  return contractor;
};

export const getMyContractorProfileService = async (userId) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  return contractor;
};

export const updateMyContractorProfileService = async (userId, updateData) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  return await updateContractorById(contractor._id, updateData);
};

export const getContractorProfileService = async (contractorId) => {
  const contractor = await findContractorById(contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  return contractor;
};

export const searchContractorsService = async (filters = {}) => {
  const query = {};

  if (filters.trade) {
    query.tradeCategories = filters.trade;
  }

  if (filters.pincode) {
    query.servicePinCodes = filters.pincode;
  }

  if (filters.verificationStatus) {
    query.verificationStatus = filters.verificationStatus;
  }

  return await findContractorByFilter(query);
};

export const getNearbyContractorsService = async (query) => {
  const { longitude, latitude, radius = 20 } = query;

  if (!longitude || !latitude) {
    throw new ApiError(400, "Longitude and latitude are required.");
  }

  return await findNearbyContractors(
    Number(longitude),
    Number(latitude),
    Number(radius),
  );
};

export const getNearbyVerifiedContractorsService = async (query) => {
  const {
    longitude,

    latitude,

    radius = 20,
  } = query;

  if (!longitude || !latitude) {
    throw new ApiError(
      400,

      "Longitude and latitude are required.",
    );
  }

  return await findNearbyVerifiedContractors(
    Number(longitude),

    Number(latitude),

    Number(radius),
  );
};



export const getNearbyContractorsByCategoryService = async (query) => {
  const {
    longitude,

    latitude,

    category,

    radius = 20,
  } = query;

  if (!category) {
    throw new ApiError(
      400,

      "Category is required.",
    );
  }

  return await findNearbyContractorsByCategory(
    Number(longitude),

    Number(latitude),

    category,

    Number(radius),
  );
};

export const getTopRatedNearbyContractorsService = async (query) => {
  const {
    longitude,

    latitude,

    radius = 20,
  } = query;

  return await findTopRatedNearbyContractors(
    Number(longitude),

    Number(latitude),

    Number(radius),
  );
};
