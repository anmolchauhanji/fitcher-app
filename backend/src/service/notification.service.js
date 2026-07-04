import ApiError from "../lib/ApiError.js";

import {
  createNotification,
  findNotificationById,
  findNotificationsByReceiver,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
} from "../repositories/notification.repository.js";

export const createNotificationService =
  async (notificationData) => {
    return await createNotification(
      notificationData
    );
  };

export const getMyNotificationsService =
  async (userId) => {
    return await findNotificationsByReceiver(
      userId
    );
  };

export const getUnreadNotificationCountService =
  async (userId) => {
    const count =
      await countUnreadNotifications(
        userId
      );

    return {
      unreadCount: count,
    };
  };

export const markNotificationAsReadService =
  async (notificationId) => {
    const notification =
      await findNotificationById(
        notificationId
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    return await markNotificationAsRead(
      notificationId
    );
  };

export const markAllNotificationsAsReadService =
  async (userId) => {
    await markAllNotificationsAsRead(
      userId
    );

    return {
      message:
        "All notifications marked as read.",
    };
  };

export const deleteNotificationService =
  async (notificationId) => {
    const notification =
      await findNotificationById(
        notificationId
      );

    if (!notification) {
      throw new ApiError(
        404,
        "Notification not found."
      );
    }

    await deleteNotificationById(
      notificationId
    );

    return {
      message:
        "Notification deleted successfully.",
    };
  };