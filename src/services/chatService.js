import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import { getRequest, postRequest } from "../helpers/index";

export const chatService = {
  createChat: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createChat, payload);
    }, options);
  },
  getChats: (payload, options) => {
    return useQuery(["chats"], () => {
      return postRequest(apiUrls.getChats, payload); 
    }, options);
  },
  updateChat: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.updateChat, payload);
    }, options);
  },
  sendMessage: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.sendMessage, payload);
    }, options);
  },
  getChatById: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.getChatById, payload);
    }, options);
  },
  deleteChat: (options) => {
    return useMutation((chatId) => {
      return getRequest(apiUrls.deleteChat(chatId));
    }, options);
  },
};