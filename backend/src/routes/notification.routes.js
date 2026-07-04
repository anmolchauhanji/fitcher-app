import { Router } from "express";

import authenticate from "../middlewares/auth.middleware.js";

import {
  createNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  createNotification
);

router.get(
  "/",
  authenticate,
  getMyNotifications
);

router.get(
  "/unread-count",
  authenticate,
  getUnreadNotificationCount
);

router.patch(
  "/read-all",
  authenticate,
  markAllNotificationsAsRead
);

router.patch(
  "/:notificationId/read",
  authenticate,
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  authenticate,
  deleteNotification
);

export default router;