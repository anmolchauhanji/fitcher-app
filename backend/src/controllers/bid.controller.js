import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createBidService,
  getMyBidsService,
  getProjectBidsService,
  acceptBidService,
  rejectBidService,
  withdrawBidService,
} from "../service/bid.service.js";

export const createBid = asyncHandler(async (req, res) => {
  const bid = await createBidService(req.user._id, req.body);

  return successResponse(
    res,
    201,
    "Bid submitted successfully.",
    bid
  );
});

export const getMyBids = asyncHandler(async (req, res) => {
  const bids = await getMyBidsService(req.user._id);

  return successResponse(
    res,
    200,
    "Bids fetched successfully.",
    bids
  );
});

export const getProjectBids = asyncHandler(async (req, res) => {
  const bids = await getProjectBidsService(
    req.params.projectId
  );

  return successResponse(
    res,
    200,
    "Project bids fetched successfully.",
    bids
  );
});

export const acceptBid = asyncHandler(async (req, res) => {
  const result = await acceptBidService(
    req.params.bidId,
    req.user.id
  );

  return successResponse(
    res,
    200,
    "Bid accepted successfully.",
    result
  );
});

export const rejectBid = asyncHandler(async (req, res) => {
  const result = await rejectBidService(
    req.params.bidId
  );

  return successResponse(
    res,
    200,
    result.message
  );
});

export const withdrawBid = asyncHandler(async (req, res) => {
  const bid = await withdrawBidService(
    req.params.bidId
  );

  return successResponse(
    res,
    200,
    "Bid withdrawn successfully.",
    bid
  );
});