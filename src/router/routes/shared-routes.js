import { lazy } from "react";
import { AllEnums } from "../../constants/enums";

const AccountSettings = lazy(() =>
  import("../../views/pages/general/account-settings")
);
const Profile = lazy(() =>
  import("../../views/pages/general/profile")
);
const HomePage = lazy(() => import("../../views/pages/general/home"));

export const sharedRoutes = [
    {
      path: "/home",
      element: <HomePage />,
      validate: (role) => {
        return role?.id == AllEnums.userRole.Admin || role?.id == AllEnums.userRole.Patient;
      },
    },
    {
        path: "/account-settings",
        element: <AccountSettings />,
        validate: (role) => {
          return role?.id == AllEnums.userRole.Admin || role?.id == AllEnums.userRole.Patient;
        },
    },
    {
        path: "/profile",
        element: <Profile />,
        validate: (role) => {
          return role?.id == AllEnums.userRole.Admin || role?.id == AllEnums.userRole.Patient;
        },
    }
];
