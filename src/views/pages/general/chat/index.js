// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Chat App Component Imports
import Chat from "./Chat";
import Sidebar from "./SidebarLeft";
import UserProfileSidebar from "./UserProfileSidebar";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  appChatSlice,
  getUserProfile,
} from "../../../../redux/features/appChat/appChatSlice";

import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import { chatService } from "../../../../services/chatService";
import { Card } from "reactstrap";

const AppChat = () => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.chat);
  // const st = useSelector((state) => state);
  // console.log("The store",st)
  const token = localStorage.getItem("token");

  // ** States
  const [user, setUser] = useState({});
  const [sidebar, setSidebar] = useState(false);
  const [userSidebarRight, setUserSidebarRight] = useState(false);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  // ** Sidebar & overlay toggle functions
  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight);
  const handleOverlayClick = () => {
    setSidebar(false);
    setUserSidebarRight(false);
    setUserSidebarLeft(false);
  };

  // ** Set user function for Right Sidebar
  const handleUser = (obj) => setUser(obj);

  //APi Call
  const { data: chatsData, isFetching: isLoading } = chatService.getChats(
    {
      active_status: "active",
      conversation_type: "all",
      is_scheduled_tab: false,
      notes_type: "inbox",
      org_chat: false,
      read_status: "all",
    },
    {
      onSuccess: (data) => {
        if (data?.data?.success) {
          // console.log(data?.data?.result?.conversationMemberships);
          dispatch(
            appChatSlice.actions.replaceChats(
              data?.data?.result?.conversationMemberships
            )
          );
        } else {
          const errs = data?.data?.result;

          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
          } else {
            SweetAlert("error", data.data.message);
          }
        }
      },
      onError: (error) => {
        const errs = error?.response?.data?.result?.referenceErrorCode
          ? null
          : error?.response?.data?.result;

        if (errs && Object.keys(errs)?.length > 0) {
          SweetAlertWithValidation(errs);
        } else {
          SweetAlert(
            "error",
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              error?.message
          );
        }
      },
      refetchOnWindowFocus: false,
      retry: false,
      networkMode: "always",
      enabled: !!token,
    }
  );

  // ** Get data on Mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);



  return (
    <Card className="flex-row justify-content-between rounded overflow-hidden" style={{minHeight: '85vh'}}>
      <Sidebar
        isLoading={isLoading}
        store={store}
        sidebar={sidebar}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
      <div className="content-right">
        <div className="content-wrapper">
          <div className="content-body">
            <div
              className={classnames("body-content-overlay", {
                show:
                  userSidebarRight === true ||
                  sidebar === true ||
                  userSidebarLeft === true,
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
            <UserProfileSidebar
              user={user}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppChat;
