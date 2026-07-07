import ApiError from "../lib/ApiError.js";
import { createWorkOrderService } from "./work-order.service.js";
import { createChatService } from "./chat.service.js";
import {
  createBid,
  findBidById,
  findBidByProjectId,
  findBidByContractorId,
  findBidByProjectAndContractor,
  updateBidById,
  updateManyBids,
  findBidsByFilter,
} from "../repositories/bid.repository.js";
import { createNotificationService } from "./notification.service.js";
import {
  findProjectById,
  updateProjectById,
  findProjectByFilter,
} from "../repositories/project.repository.js";

import {
  findContractorById,
  findContractorByUserId,
} from "../repositories/contractor.repository.js";
import { findUserById } from "../repositories/user.repository.js";

export const createBidService = async (userId, bidData) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  if (contractor.verificationStatus !== "verified") {
    throw new ApiError(403, "Only verified contractors can submit bids");
  }

  const project = await findProjectById(bidData.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Project is not accepting bids");
  }

  if (project.expiresAt < new Date()) {
    throw new ApiError(400, "Project bidding has expired");
  }

  if (project.customerId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot bid on your own project");
  }

  const existingBid = await findBidByProjectAndContractor(
    project._id,
    contractor._id,
  );

  if (existingBid) {
    throw new ApiError(409, "You have already submitted a bid");
  }

 const bid = await createBid({
  ...bidData,
  contractorId: contractor._id,
});

await createNotificationService({
  receiverId: project.customerId,
  senderId: userId,
  type: "NEW_BID",
  title: "New Bid Received",
  message: `${contractor.businessName} submitted a bid on your project.`,
  data: {
    projectId: project._id,
    bidId: bid._id,
  },
});

return bid;
};

export const getMyBidsService = async (userId) => {
  const contractor = await findContractorByUserId(userId);

  if (!contractor) {
    const user = await findUserById(userId);

    if (!user || user.role !== "customer") {
      throw new ApiError(404, "Contractor profile not found");
    }

    const projects = await findProjectByFilter({ customerId: userId });
    const projectIds = projects.map((project) => project._id);

    return await findBidsByFilter({ projectId: { $in: projectIds } });
  }

  return await findBidByContractorId(contractor._id);
};

export const getProjectBidsService = async (projectId) => {
  return await findBidByProjectId(projectId);
};

export const rejectBidService = async (bidId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  const project = await findProjectById(bid.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (bid.status !== "pending") {
    throw new ApiError(400, "Only pending bids can be rejected");
  }

  await updateBidById(bidId, {
    status: "rejected",
  });

  const contractor = await findContractorById(bid.contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  await createNotificationService({
    receiverId: contractor.userId,
    senderId: project.customerId,
    type: "BID_REJECTED",
    title: "Bid Rejected",
    message: "Your bid has been rejected.",
    data: {
      projectId: bid.projectId,
      bidId: bid._id,
    },
  });

  return {
    message: "Bid rejected successfully",
  };
};

export const acceptBidService = async (bidId, userId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  const project = await findProjectById(bid.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Only project owner can accept
  if (project.customerId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to accept this bid");
  }

  if (project.status !== "open") {
    throw new ApiError(400, "Project is no longer accepting bids");
  }

  if (bid.status !== "pending") {
    throw new ApiError(400, "Only pending bids can be accepted");
  }

  await updateBidById(bid._id, {
    status: "accepted",
  });

  await updateManyBids(
    {
      projectId: bid.projectId,
      _id: {
        $ne: bid._id,
      },
    },
    {
      status: "rejected",
    },
  );
await createChatService({
    project,
    bid,
});
  await createWorkOrderService({
    project,
    bid,
  });
  await updateProjectById(bid.projectId, {
    status: "in_progress",
    selectedBidId: bid._id,
  });

  const contractor = await findContractorById(bid.contractorId);

  if (!contractor) {
    throw new ApiError(404, "Contractor profile not found");
  }

  await createNotificationService({
    receiverId: contractor.userId,
    senderId: userId,
    type: "BID_ACCEPTED",
    title: "Bid Accepted",
    message:
      "Congratulations! Your bid has been accepted.",
    data: {
      projectId: project._id,
      bidId: bid._id,
    },
  });

  return {
    message: "Bid accepted successfully",
  };
};

export const withdrawBidService = async (bidId) => {
  const bid = await findBidById(bidId);

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  if (bid.status !== "pending") {
    throw new ApiError(400, "Only pending bids can be withdrawn");
  }

  return await updateBidById(bidId, {
    status: "withdrawn",
  });
};
