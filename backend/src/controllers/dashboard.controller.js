import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import { getDashboardService } from "../service/dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboardService(req.user.id);

  return successResponse(
    res,
    200,
    "Dashboard fetched successfully.",
    dashboard
  );
});