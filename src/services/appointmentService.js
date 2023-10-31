import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import { getRequest, postRequest, deleteRequestByUrl, deleteRequestByPayload, deleteRequestById } from "../helpers/index";


export const appointmentService = {
  createAppointment: (payload, options) => {
    return useMutation(() => {
      return postRequest(apiUrls.createAppointment, payload);
    }, options);
  },
  getAppointments: (payload, options) => {
    return useQuery(["appointments"], () => {
      return getRequest(apiUrls.getAppointments(payload));
    }, options);
  },
  updateAppointment: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.updateAppointment, payload);
    }, options);
  },
  getAppointmentById: (options) => {
    return useMutation((appointmentId) => {
      return getRequest(apiUrls.getAppointmentById(appointmentId));
    }, options);
  },
  deleteAppointment: (payload, options) => {
    return useMutation((appointmentId) => {
      return deleteRequestById(apiUrls.deleteAppointment, payload.id);
    }, options);
  },
  getOrganizationInstructors: (payload, options) => {
    return useQuery(["organizationInstructors"], () => {
      return postRequest(apiUrls.getOrganizationInstructors, payload);
    }, options);
  },
  getDaysAvailable: (payload, options) => {
    return useMutation(["daysAvailable"], () => {
      return postRequest(apiUrls.getDaysAvailable, payload);
    }, options);
  },
  getDaysAvailableSlot: (payload, options) => {
    return useMutation(["daysAvailableSlot"], () => {
      return postRequest(apiUrls.getDaysAvailableSlot, payload);
    }, options);
  },
  getAppointmentTypes: (payload, options) => {
    return useQuery(["appointmentTypes"], () => {
      return postRequest(apiUrls.getAppointmentTypes, payload);
    }, options);
  },
};
