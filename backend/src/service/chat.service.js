import ApiError from "../lib/ApiError.js";

import {
  createChat,
  findChatById,
  findChatByProjectId,
  findChatsByCustomer,
  findChatsByContractor,
  updateChatById,
} from "../repositories/chat.repository.js";

import {
  createMessage,
  findMessagesByChatId,
  markMessagesAsRead,
} from "../repositories/message.repository.js";

import {
  findProjectById,
} from "../repositories/project.repository.js";

import {
  findContractorByUserId,
} from "../repositories/contractor.repository.js";


// Create Chat Automatically
export const createChatService = async ({
  project,
  bid,
}) => {

  const existing =
    await findChatByProjectId(
      project._id
    );

  if (existing) {
    return existing;
  }

  return await createChat({
    projectId: project._id,

    bidId: bid._id,

    customerId:
      project.customerId,

    contractorId:
      bid.contractorId,
  });
};


// Customer Chats
export const getCustomerChatsService =
  async (userId) => {

    return await findChatsByCustomer(
      userId
    );

  };


// Contractor Chats
export const getContractorChatsService =
  async (userId) => {

    const contractor =
      await findContractorByUserId(
        userId
      );

    if (!contractor) {
      throw new ApiError(
        404,
        "Contractor profile not found"
      );
    }

    return await findChatsByContractor(
      contractor._id
    );

  };


// Get Messages
export const getMessagesService =
  async (chatId) => {

    const chat =
      await findChatById(chatId);

    if (!chat) {
      throw new ApiError(
        404,
        "Chat not found"
      );
    }

    return await findMessagesByChatId(
      chatId
    );

  };


// Send Message
export const sendMessageService =
  async (
    chatId,
    senderId,
    data
  ) => {

    const chat =
      await findChatById(chatId);

    if (!chat) {
      throw new ApiError(
        404,
        "Chat not found"
      );
    }

    const message =
      await createMessage({

        chatId,

        senderId,

        message:
          data.message,

        messageType:
          data.messageType,

        attachment:
          data.attachment,

      });

    await updateChatById(
      chatId,
      {
        lastMessage:
          data.message,

        lastMessageAt:
          new Date(),
      }
    );

    return message;

  };


// Read Messages
export const markChatReadService =
  async (
    chatId,
    userId
  ) => {

    await markMessagesAsRead(
      chatId,
      userId
    );

    return {
      message:
        "Messages marked as read",
    };

  };