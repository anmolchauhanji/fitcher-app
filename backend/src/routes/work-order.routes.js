import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
  getCustomerWorkOrders,
  getContractorWorkOrders,
  completeWorkOrder,
} from "../controllers/work-order.controller.js";

const router = Router();

router.get(
  "/customer",
  authenticate,
  authorize("customer"),
  getCustomerWorkOrders
);

router.get(
  "/contractor",
  authenticate,
  authorize("contractor"),
  getContractorWorkOrders
);

router.patch(
  "/:workOrderId/complete",
  authenticate,
  authorize("customer"),
  completeWorkOrder
);

export default router;