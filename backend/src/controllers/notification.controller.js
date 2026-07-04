import asyncHandler from "../lib/asyncHandler.js";
import { successResponse } from "../lib/response.js";

import {
  createNotificationService,
  getMyNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
} from "../service/notification.service.js";

export const createNotification =
  asyncHandler(async (req, res) => {
    const notification =
      await createNotificationService(
        req.body
      );

    return successResponse(
      res,
      201,
      "Notification created successfully.",
      notification
    );
  });

export const getMyNotifications =
  asyncHandler(async (req, res) => {
    const notifications =
      await getMyNotificationsService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      "Notifications fetched successfully.",
      notifications
    );
  });

export const getUnreadNotificationCount =
  asyncHandler(async (req, res) => {
    const data =
      await getUnreadNotificationCountService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      "Unread notification count fetched successfully.",
      data
    );
  });

export const markNotificationAsRead =
  asyncHandler(async (req, res) => {
    const notification =
      await markNotificationAsReadService(
        req.params.notificationId
      );

    return successResponse(
      res,
      200,
      "Notification marked as read.",
      notification
    );
  });

export const markAllNotificationsAsRead =
  asyncHandler(async (req, res) => {
    const result =
      await markAllNotificationsAsReadService(
        req.user._id
      );

    return successResponse(
      res,
      200,
      result.message,
      null
    );
  });

export const deleteNotification =
  asyncHandler(async (req, res) => {
    const result =
      await deleteNotificationService(
        req.params.notificationId
      );

    return successResponse(
      res,
      200,
      result.message,
      null
    );
  });