import Message from "../models/Message.model.js";

export const createMessage = async (
  messageData
) => {
  return await Message.create(
    messageData
  );
};

export const findMessageById = async (
  messageId
) => {
  return await Message.findById(
    messageId
  );
};

export const findMessagesByChatId =
  async (chatId) => {
    return await Message.find({
      chatId,
    }).sort({
      createdAt: 1,
    });
  };

export const updateMessageById =
  async (
    messageId,
    updateData
  ) => {
    return await Message.findByIdAndUpdate(
      messageId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  };

export const deleteMessageById =
  async (messageId) => {
    return await Message.findByIdAndDelete(
      messageId
    );
  };

export const countUnreadMessages =
  async (chatId, userId) => {
    return await Message.countDocuments({
      chatId,
      senderId: {
        $ne: userId,
      },
      isRead: false,
    });
  };

export const markMessagesAsRead =
  async (chatId, userId) => {
    return await Message.updateMany(
      {
        chatId,
        senderId: {
          $ne: userId,
        },
        isRead: false,
      },
      {
        isRead: true,
      }
    );
  };