import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import { getRequest, postRequest, putRequest } from "../helpers/index";

export const notificationSettingsService = {
  updateNotificationSettings: (options) => {
    return useMutation((payload) => {
      return putRequest(apiUrls.updateNotificationSettings, payload);
    }, options);
  },
  getNotificationSettingsByID: (key, id, options) => {
    return useQuery(
      [key, id],
      () => {
        return getRequest(apiUrls.getNotificationSettingsByID(id));
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
};
