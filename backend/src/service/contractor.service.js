import ApiError from "../lib/ApiError.js";

import {
  createContractor,
  findContractorById,
  findContractorByUserId,
  findContractorByFilter,
  updateContractorById,
} from "../repositories/contractor.repository.js";

import {
  findUserById,
  updateUserById,
} from "../repositories/user.repository.js";

export const createContractorProfileService = async (
  userId,
  contractorData
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

export const updateMyContractorProfileService = async (
  userId,
  updateData
) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  return await updateContractorById(
    contractor._id,
    updateData
  );
};

export const getContractorProfileService = async (
  contractorId
) => {
  const contractor = await findContractorById(contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  return contractor;
};

export const searchContractorsService = async (
  filters = {}
) => {
  const query = {};

  if (filters.trade) {
    query.tradeCategories = filters.trade;
  }

  if (filters.pincode) {
    query.servicePinCodes = filters.pincode;
  }

  if (filters.verificationStatus) {
    query.verificationStatus =
      filters.verificationStatus;
  }

  return await findContractorByFilter(query);
};