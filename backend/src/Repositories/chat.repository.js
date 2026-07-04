import Chat from "../models/Chat.model.js";

export const createChat = async (chatData) => {
  return await Chat.create(chatData);
};

export const findChatById = async (chatId) => {
  return await Chat.findById(chatId);
};

export const findChatByProjectId = async (
  projectId
) => {
  return await Chat.findOne({
    projectId,
  });
};

export const findChatsByCustomer = async (
  customerId
) => {
  return await Chat.find({
    customerId,
  }).sort({
    lastMessageAt: -1,
  });
};

export const findChatsByContractor =
  async (contractorId) => {
    return await Chat.find({
      contractorId,
    }).sort({
      lastMessageAt: -1,
    });
  };

export const updateChatById = async (
  chatId,
  updateData
) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );
};

export const deleteChatById = async (
  chatId
) => {
  return await Chat.findByIdAndDelete(
    chatId
  );
};