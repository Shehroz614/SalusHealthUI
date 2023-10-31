import { AllEnums } from "./enums";

const userId = localStorage.getItem("user")?.id

export const apiUrls = {
  // AUTH
  login: "/auth/login",
  me: "/auth/me",
  registerUser: "/user/register",
  userExists: (email) => `/users/exists/${email}`,
  sendOtp: (email) => `/users/send-otp?email=${email}`,
  forgotPassword: "/auth/forgot-password",

  // NOTIFICATION SETTINGS
  updateNotificationSettings: "/notification/settings",
  getNotificationSettingsByID: (id) => `/notification/settings/${id}`,

  // USER
  updateProfile: "/account/personalInfo",

  // CHAT
  createChat: "/chats/create",
  getChats: "/chat", 
  getChatById: `/chat/conversation`, 
  updateChat: (chatId) => `/chats/${chatId}/update`, 
  deleteChatById: (chatId) => `/chats/${chatId}/delete`,
  sendMessage: "/chat/newChat",


  // GOALS
  createGoal: "/goals/create",
  getGoals: `/home/goals?start_range="2020-09-07"&date_range_is_selected=false&end_range="2030-09-27"&frequency_filter="all"&sort_by="end_date_asc"&status_filter="all"&user_id=${userId}&offset=0`, 
  getGoalById: (goalId) => `/goals/${goalId}`,
  updateGoal: `/home/goals`,
  deleteGoalById: (goalId) => `/goals/${goalId}/delete`,


  // APPOINTMENTS
  createAppointment: "/appointment/create",
  // getAppointments: (data) => `/appointment?sort_by="date_desc"&user_id=${data?.userId}&offset=0`,
  getAppointments: (data) => `/appointment?sort_by="date_asc"&user_id=${data?.userId}&offset=0`,
  getAppointmentById: (appointmentId) => `/appointments/${appointmentId}`,
  updateAppointment: (appointmentId) => `/appointments/${appointmentId}/update`,
  deleteAppointment: `/appointment/deleteAppointment/`,
  getOrganizationInstructors: "/appointment/getOrganization",
  getDaysAvailable: "/appointment/getDaysAvailable",
  getDaysAvailableSlot: "/appointment/getDaysAvailableSlot",
  getAppointmentTypes: "/appointment/appointmentsTypesData",
};


// SITE INFORMATION BELOW
export const siteInfo = {
  siteLongName: import.meta.env.VITE_SITE_LONG_NAME,
  siteShortName: import.meta.env.VITE_SITE_SHORT_NAME,
  admin: {
    defaultRoute: import.meta.env.VITE_ADMIN_DEFAULT_ROUTE,
  },
  client: {
    defaultRoute: import.meta.env.VITE_CLIENT_DEFAULT_ROUTE,
  },
};
