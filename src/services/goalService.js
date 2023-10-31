import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import { getRequest, postRequest, putRequest } from "../helpers/index";

export const goalService = {
  // Create a new goal
  createGoal: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createGoal, payload);
    }, options);
  },

  // Get a list of goals
  getGoals: (key, options) => {
    return useQuery(key, () => {
      return getRequest(apiUrls.getGoals);
    }, options);
  },

  // Get a single goal by ID
  getGoalById: (key, goalId, options) => {
    return useQuery(key, () => {
      return getRequest(apiUrls.getGoalById(goalId));
    }, options);
  },

  // Update an existing goal
  updateGoal: (options) => {
    return useMutation((payload) => {
      return putRequest(apiUrls.updateGoal, payload);
    }, options);
  },

  // Delete a goal by ID
  deleteGoalById: (options) => {
    return useMutation((goalId) => {
      return postRequest(apiUrls.deleteGoalById(goalId));
    }, options);
  },
};
