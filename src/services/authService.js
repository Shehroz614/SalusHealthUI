import { useMutation, useQuery } from "@tanstack/react-query"
import { apiUrls } from "../constants"
import { getRequest, postRequest } from "../helpers/index"

export const authService = {
    login: (options) => {
        return useMutation((payload) => {
            return postRequest(apiUrls.login, payload)
        }, options)
    },
    userExists: (options) => {
        return useMutation((email) => {
            return getRequest(apiUrls.userExists(email))
        }, options)
    },
    sendOtp: (options) => {
        return useMutation((email) => {
            return getRequest(apiUrls.sendOtp(email))
        }, options)
    },
    me: (key, options) => {
        return useQuery(key, () => {
           return getRequest(apiUrls.me)
        }, options)
    },
    registerUser: (options) => {
      return useMutation((payload) => {
        return postRequest(apiUrls.registerUser, payload);
      }, options);
    },
    forgotPassword: (options) => {
        return useMutation((payload) => {
            return postRequest(apiUrls.forgotPassword, payload)
        }, options)
    },
}
