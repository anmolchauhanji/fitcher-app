import Bid from "../models/Bid.model.js";

export const createBid = async (bidData) => {
  return await Bid.create(bidData);
};

export const findBidById = async (bidId) => {
  return await Bid.findById(bidId);
};

export const findBidByFilter = async (filter = {}) => {
  return await Bid.find(filter);
};

export const findOneBid = async (filter = {}) => {
  return await Bid.findOne(filter);
};

export const existsBid = async (filter = {}) => {
  return await Bid.exists(filter);
};

export const countBids = async (filter = {}) => {
  return await Bid.countDocuments(filter);
};

export const updateBid = async (bidId, updateData) => {
  return await Bid.findByIdAndUpdate(
    bidId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteBid = async (bidId) => {
  return await Bid.findByIdAndDelete(bidId);
};