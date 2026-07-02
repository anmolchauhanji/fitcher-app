import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createWorkOrderService,
  getMyCustomerWorkOrdersService,
  getMyContractorWorkOrdersService,
  completeWorkOrderService,
} from "../service/work-order.service.js";

export const createWorkOrder = asyncHandler(
  async (req, res) => {
    const workOrder =
      await createWorkOrderService(req.body);

    return successResponse(
      res,
      201,
      "Work order created successfully.",
      workOrder
    );
  }
);

export const getCustomerWorkOrders =
  asyncHandler(async (req, res) => {
    const orders =
      await getMyCustomerWorkOrdersService(
        req.user.id
      );

    return successResponse(
      res,
      200,
      "Work orders fetched successfully.",
      orders
    );
  });

export const getContractorWorkOrders =
  asyncHandler(async (req, res) => {
    const orders =
      await getMyContractorWorkOrdersService(
        req.user.id
      );

    return successResponse(
      res,
      200,
      "Work orders fetched successfully.",
      orders
    );
  });

export const completeWorkOrder =
  asyncHandler(async (req, res) => {
    const workOrder =
      await completeWorkOrderService(
        req.params.workOrderId,
        req.user.id
      );

    return successResponse(
      res,
      200,
      "Work order completed successfully.",
      workOrder
    );
  });