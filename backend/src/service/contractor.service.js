import ApiError from "../lib/ApiError.js";
import {
  createContractor,
  findContractorById,
  findContractorByUserId,
  findContractorByFilter,
  updateContractorById,
  deleteContractorById,
} from "../repositories/contractor.repository.js";

export const createContractorService = async (
  userId,
  contractorData
) => {
  const existingContractor = await findContractorByUserId(userId);

  if (existingContractor) {
    throw new ApiError(409, "Contractor profile already exists");
  }

  return await createContractor({
    userId,
    ...contractorData,
  });
};

export const getContractorByIdService = async (contractorId) => {
  const contractor = await findContractorById(contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  return contractor;
};

export const getContractorsService = async (filter = {}) => {
  return await findContractorByFilter(filter);
};

export const updateContractorService = async (
  contractorId,
  updateData
) => {
  const contractor = await findContractorById(contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  return await updateContractorById(contractorId, updateData);
};

export const deleteContractorService = async (contractorId) => {
  const contractor = await findContractorById(contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  await deleteContractorById(contractorId);

  return {
    message: "Contractor deleted successfully",
  };
};