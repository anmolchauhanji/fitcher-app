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

export const findContractorByVerificationStatus = async (status) => {
  return await Contractor.find({ verificationStatus: status });
};

export const findContractorsByTradeCategory = async (category) => {
  return await Contractor.find({
    tradeCategories: category,
  });
};

export const findContractorsByPinCode = async (pinCode) => {
  return await Contractor.find({
    servicePinCodes: pinCode,
  });
};

export const findContractorByFilter = async (filter = {}) => {
  return await Contractor.find(filter);
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

export const deleteContractorById = async (contractorId) => {
  return await Contractor.findByIdAndDelete(contractorId);
};