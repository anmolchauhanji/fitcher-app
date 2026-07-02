import ApiError from "../lib/ApiError.js";

import {
  createWorkOrder,
  findWorkOrderByProjectId,
} from "../repositories/work-order.repository.js";

export const createWorkOrderService =
  async ({
    project,
    bid,
  }) => {
    const existing =
      await findWorkOrderByProjectId(
        project._id
      );

    if (existing) {
      throw new ApiError(
        409,
        "Work order already exists."
      );
    }

    return await createWorkOrder({
      projectId: project._id,

      bidId: bid._id,

      customerId:
        project.customerId,

      contractorId:
        bid.contractorId,

      agreedAmount:
        bid.totalCost,

      estimatedDays:
        bid.completionDays,
    });
  };