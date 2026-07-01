import Bid from "../models/Bid.model.js";

export const createBid = async (bidData) => {
  return await Bid.create(bidData);
};

export const findBidById = async (bidId) => {
  return await Bid.findById(bidId);
};

export const findBidByProjectId = async (projectId) => {
  return await Bid.find({ projectId });
};

export const findBidByContractorId = async (contractorId) => {
  return await Bid.find({ contractorId });
};

export const findBidByProjectAndContractor = async (
  projectId,
  contractorId
) => {
  return await Bid.findOne({
    projectId,
    contractorId,
  });
};

export const findBidsByFilter = async (filter = {}) => {
  return await Bid.find(filter);
};

export const existsBid = async (filter = {}) => {
  return await Bid.exists(filter);
};

export const countBids = async (filter = {}) => {
  return await Bid.countDocuments(filter);
};

export const updateBidById = async (
  bidId,
  updateData
) => {
  return await Bid.findByIdAndUpdate(
    bidId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const updateManyBids = async (
  filter,
  updateData
) => {
  return await Bid.updateMany(
    filter,
    updateData
  );
};