import Notification from "../models/Notification.model.js";

export const createNotification = async (
  notificationData
) => {
  return await Notification.create(
    notificationData
  );
};

export const findNotificationById = async (
  notificationId
) => {
  return await Notification.findById(
    notificationId
  );
};

export const findNotificationsByReceiver =
  async (receiverId) => {
    return await Notification.find({
      receiverId,
    }).sort({
      createdAt: -1,
    });
  };

export const countUnreadNotifications =
  async (receiverId) => {
    return await Notification.countDocuments(
      {
        receiverId,
        isRead: false,
      }
    );
  };

export const markNotificationAsRead =
  async (notificationId) => {
    return await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  };

export const markAllNotificationsAsRead =
  async (receiverId) => {
    return await Notification.updateMany(
      {
        receiverId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );
  };

export const deleteNotificationById =
  async (notificationId) => {
    return await Notification.findByIdAndDelete(
      notificationId
    );
  };
  