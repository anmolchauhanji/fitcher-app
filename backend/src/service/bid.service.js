import ApiError from "../lib/ApiError.js";
import {
  createBid,
  findBidById,
  findBidByFilter,
  findOneBid,
  updateBid,
  deleteBid,
} from "../repositories/bid.repository.js";
import { findProjectById, updateProject } from "../repositories/project.repository.js";
import { findContractorByUserId } from "../repositories/contractor.repository.js";

export const createBidService = async (userId, bidData) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  const project = await findProjectById(bidData.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Bidding is closed for this project");
  }

  const existingBid = await findOneBid({
    projectId: bidData.projectId,
    contractorId: contractor._id,
  });

  if (existingBid) {
    throw new ApiError(
      409,
      "You have already submitted a bid for this project"
    );
  }

  return await createBid({
    ...bidData,
    contractorId: contractor._id,
  });
};

export const getBidByIdService = async (bidId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  return bid;
};

export const getBidsService = async (filter = {}) => {
  return await findBidByFilter(filter);
};

export const updateBidService = async (bidId, updateData) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  return await updateBid(bidId, updateData);
};

export const deleteBidService = async (bidId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  await deleteBid(bidId);

  return {
    message: "Bid deleted successfully",
  };
};

export const acceptBidService = async (bidId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  await updateBid(bidId, {
    status: "accepted",
  });

  await updateProject(bid.projectId, {
    selectedBidId: bid._id,
    status: "in_progress",
  });

  return {
    message: "Bid accepted successfully",
  };
};