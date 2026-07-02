import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createContractorProfileService,
  getMyContractorProfileService,
  updateMyContractorProfileService,
  getContractorProfileService,
  searchContractorsService,
} from "../service/contractor.service.js";

export const createContractorProfile = asyncHandler(async (req, res) => {
  const contractor = await createContractorProfileService(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    201,
    "Contractor profile created successfully.",
    contractor
  );
});

export const getMyContractorProfile = asyncHandler(async (req, res) => {
  const contractor = await getMyContractorProfileService(req.user._id);

  return successResponse(
    res,
    200,
    "Contractor profile fetched successfully.",
    contractor
  );
});

export const updateMyContractorProfile = asyncHandler(async (req, res) => {
  const contractor = await updateMyContractorProfileService(
    req.user._id,
    req.body
  );

  return successResponse(
    res,
    200,
    "Contractor profile updated successfully.",
    contractor
  );
});

export const getContractorProfile = asyncHandler(async (req, res) => {
  const contractor = await getContractorProfileService(
    req.params.contractorId
  );

  return successResponse(
    res,
    200,
    "Contractor fetched successfully.",
    contractor
  );
});

export const searchContractors = asyncHandler(async (req, res) => {
  const contractors = await searchContractorsService(req.query);

  return successResponse(
    res,
    200,
    "Contractors fetched successfully.",
    contractors
  );
});