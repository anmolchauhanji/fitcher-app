import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
  getCustomerChats,
  getContractorChats,
  getMessages,
  sendMessage,
  markChatRead,
} from "../controllers/chat.controller.js";

const router = Router();

router.get(
  "/customer",
  authenticate,
  authorize("customer"),
  getCustomerChats
);

router.get(
  "/contractor",
  authenticate,
  authorize("contractor"),
  getContractorChats
);

router.get(
  "/:chatId/messages",
  authenticate,
  getMessages
);

router.post(
  "/:chatId/messages",
  authenticate,
  sendMessage
);

router.patch(
  "/:chatId/read",
  authenticate,
  markChatRead
);

export default router;