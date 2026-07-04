import asyncHandler from "../lib/asyncHandler.js";
import {
  successResponse,
} from "../lib/response.js";

import {
  getCustomerChatsService,
  getContractorChatsService,
  getMessagesService,
  sendMessageService,
  markChatReadService,
} from "../service/chat.service.js";

export const getCustomerChats =
  asyncHandler(async (req, res) => {
    const chats =
      await getCustomerChatsService(
        req.user.id
      );

    return successResponse(
      res,
      200,
      "Chats fetched successfully",
      chats
    );
  });

export const getContractorChats =
  asyncHandler(async (req, res) => {
    const chats =
      await getContractorChatsService(
        req.user.id
      );

    return successResponse(
      res,
      200,
      "Chats fetched successfully",
      chats
    );
  });

export const getMessages =
  asyncHandler(async (req, res) => {
    const messages =
      await getMessagesService(
        req.params.chatId
      );

    return successResponse(
      res,
      200,
      "Messages fetched successfully",
      messages
    );
  });

export const sendMessage =
  asyncHandler(async (req, res) => {
    const message =
      await sendMessageService(
        req.params.chatId,
        req.user.id,
        req.body
      );

    return successResponse(
      res,
      201,
      "Message sent successfully",
      message
    );
  });

export const markChatRead =
  asyncHandler(async (req, res) => {
    const result =
      await markChatReadService(
        req.params.chatId,
        req.user.id
      );

    return successResponse(
      res,
      200,
      result.message
    );
  });