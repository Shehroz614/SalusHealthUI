import { lazy } from "react";
import { AllEnums } from "../../constants/enums";

const ChatPage = lazy(() => import("../../views/pages/general/chat"));
const SessionsPage = lazy(() => import("../../views/pages/general/sessions"));
const DevicesPage = lazy(() => import("../../views/pages/general/devices"));
const BookSessionPage = lazy(() => import("../../views/pages/general/sessions/subpages/join-session"));
const GoalsPage = lazy(() => import("../../views/pages/general/goal"));
const JoinSession = lazy(() => import("../../views/pages/general/sessions/subpages/session"));
const ProfilePage = lazy(() => import("../../views/pages/general/profile"));

export const clientRoutes = [
  {
    path: "/chat",
    element: <ChatPage />,
    meta: {
      className: "chat-application",
    },
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  {
    path: "/sessions",
    element: <SessionsPage />,
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  {
    path: "/devices",
    element: <DevicesPage />,
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  {
    path: "/book-session",
    element: <BookSessionPage />,
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  {
    path: "/goals",
    element: <GoalsPage />,
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  {
    path: "/sessions/:id",
    element: <JoinSession />,
    validate: (role) => {
      return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
    },
  },
  // {
  //   path: "/profile",
  //   element: <ProfilePage />,
  //   validate: (role) => {
  //     return role?.id > 0 && role?.id == AllEnums.userRole.Patient;
  //   },
  // },
];
