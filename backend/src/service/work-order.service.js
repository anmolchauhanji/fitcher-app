import ApiError from "../lib/ApiError.js";

import {
  createWorkOrder,
  findWorkOrderByProjectId,
  findWorkOrdersByCustomer,
  findWorkOrdersByContractor,
  updateWorkOrderById,
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

export const getMyCustomerWorkOrdersService =
  async (customerId) => {
    return await findWorkOrdersByCustomer(
      customerId
    );
  };

export const getMyContractorWorkOrdersService =
  async (contractorId) => {
    return await findWorkOrdersByContractor(
      contractorId
    );
  };

export const completeWorkOrderService =
  async (workOrderId, userId) => {
    const workOrder =
      await updateWorkOrderById(workOrderId, {
        status: "completed",
        completedAt: new Date(),
      });

    if (!workOrder) {
      throw new ApiError(
        404,
        "Work order not found."
      );
    }

    return workOrder;
  };