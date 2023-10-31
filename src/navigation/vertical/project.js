import {
  Bluetooth,
  Calendar,
  Home,
  MessageCircle,
  ShoppingBag,
} from "react-feather";
import { AllEnums } from "../../constants/enums/index";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
    validate: (role) => (role?.id > 0 && (role?.id == AllEnums.userRole.Patient || role?.id == AllEnums.userRole.Admin)),
  },
  {
    id: "chat",
    title: "Chat",
    icon: <MessageCircle size={20} />,
    navLink: "/chat",
    validate: (role) => role?.id > 0 && role?.id == AllEnums.userRole.Patient,
  },
  {
    id: "my-sessions",
    title: "My Sessions",
    icon: <Calendar size={20} />,
    navLink: "/sessions",
    validate: (role) => role?.id > 0 && role?.id == AllEnums.userRole.Patient,
  },
  // {
  //   id: "devices",
  //   title: "Devices",
  //   icon: <Bluetooth size={20} />,
  //   navLink: "/devices",
  //   validate: (role) => role?.id > 0 && role?.id == AllEnums.userRole.Patient,
  // },
];
