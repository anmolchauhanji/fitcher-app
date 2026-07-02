import ApiError from "../lib/ApiError.js";

import {
  getCustomerDashboardStats,
  getContractorDashboardStats,
} from "../repositories/dashboard.repository.js";

import { findUserById } from "../repositories/user.repository.js";

export const getDashboardService = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "customer") {
    const dashboard = await getCustomerDashboardStats(user._id);

    return {
      role: "customer",
      ...dashboard,
    };
  }

  if (user.role === "contractor") {
    const dashboard = await getContractorDashboardStats(user._id);

    if (!dashboard) {
      throw new ApiError(
        404,
        "Contractor profile not found"
      );
    }

    return {
      role: "contractor",
      ...dashboard,
    };
  }

  throw new ApiError(403, "Invalid user role");
};