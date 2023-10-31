import { useMutation, useQuery } from "@tanstack/react-query"
import { apiUrls } from "../constants"
import { getRequest, postRequest, putRequest } from "../helpers/index"

export const userService = {
    updateProfile: (options) => {
        return useMutation((payload) => {
            return putRequest(apiUrls.updateProfile, payload)
        }, options)
    },
}
