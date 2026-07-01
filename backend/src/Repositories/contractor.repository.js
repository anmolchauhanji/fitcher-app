import Contractor from "../models/Contractor.model.js";

export const createContractor = async (contractorData) => {
  return await Contractor.create(contractorData);
};

export const findContractorById = async (contractorId) => {
  return await Contractor.findById(contractorId);
};

export const findContractorByUserId = async (userId) => {
  return await Contractor.findOne({ userId });
};

export const findContractorByFilter = async (filter = {}) => {
  return await Contractor.find(filter);
};

export const existsContractor = async (filter = {}) => {
  return await Contractor.exists(filter);
};

export const countContractors = async (filter = {}) => {
  return await Contractor.countDocuments(filter);
};

export const updateContractorById = async (
  contractorId,
  updateData
) => {
  return await Contractor.findByIdAndUpdate(
    contractorId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};