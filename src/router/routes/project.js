import { lazy } from "react";
import { AllEnums } from "../../constants/enums";
import { adminRoutes } from "./admin-routes";
import { clientRoutes } from "./client-routes";
import { sharedRoutes } from "./shared-routes";

export const projectRoutes = [
  ...adminRoutes,
  ...clientRoutes,
  ...sharedRoutes
];
