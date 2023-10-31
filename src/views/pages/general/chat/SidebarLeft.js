// ** React Imports
import { useState, useEffect } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { selectChat } from "../../../../redux/features/appChat/appChatSlice";
import { useDispatch } from "react-redux";

// ** Utils
import { formatDateToMonthShort, isObjEmpty } from "@utils";

// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  X,
  Search,
  CheckSquare,
  Bell,
  User,
  Trash,
  MessageSquare,
  MessageCircle,
} from "react-feather";

// ** Reactstrap Imports
import {
  CardText,
  InputGroup,
  InputGroupText,
  Badge,
  Input,
  Button,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
import { chatService } from "../../../../services/chatService";
import { appChatSlice } from "../../../../redux/features/appChat/appChatSlice";
import {
  SweetAlert,
  SweetAlertWithValidation,
} from "../../../../components/SweetAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import avatar_blank from "../../../../assets/images/avatars/avatar-blank.png";
import no_result from "../../../../assets/images/svg/no-result.svg"
import { AnimatePresence, motion } from "framer-motion";

const SidebarLeft = (props) => {
  // ** Props & Store
  const {
    store,
    sidebar,
    handleSidebar,
    userSidebarLeft,
    handleUserSidebarLeft,
  } = props;
  const { chats, contacts, userProfile } = store;

  // ** Dispatch
  const dispatch = useDispatch();

  // ** State
  const [query, setQuery] = useState("");
  const [about, setAbout] = useState("");
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState("online");
  const [filteredChat, setFilteredChat] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const chat = useRef({});

  const queryClient = useQueryClient();

  // ** Handles User Chat Click
  const handleUserClick = (item) => {
    const data = {
      conversation_id: item.conversation_id,
      org_chat: false,
      scheduled_notes: false,
      sort_by: "created_at_desc",
      offset: 0,
    };
    setActive(item.id);
    chat.current = item;
    dispatch(
      appChatSlice.actions.selectChat({ chat: chat.current, loading: true })
    );
    selectChat(data);
    if (sidebar === true) {
      handleSidebar();
    }
  };

  useEffect(() => {
    if (!isObjEmpty(store.selectedUser)) {
      if (store.selectedUser.chat) {
        setActive(store?.selectedUser?.chat?.id);
      } else {
        setActive(store?.selectedUser?.contact?.id);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(appChatSlice.actions.selectChat({}));
    setActive(-1);
  }, []);

  //Select chat
  const { mutate: selectChat, isLoading: isLoadingChat } =
    chatService.getChatById({
      onSuccess: async (response) => {
        // console.log(response);
        if (response?.data?.success == true) {
          if (
            chat.current.conversation_id ===
            JSON.parse(response?.config?.data)?.conversation_id
          ) {
            dispatch(
              appChatSlice.actions.selectChat({
                chat: chat.current,
                data: response?.data?.result?.notes,
                loading: false,
              })
            );
          }
          // queryClient.invalidateQueries('chats');
        } else {
          setActive(-1);
          const errs = response.data.result;
          if (errs && Object.keys(errs)?.length > 0) {
            SweetAlertWithValidation(errs);
            return;
          } else {
            const errMsg = response.data.message.split(".")[0];
            SweetAlert("error", errMsg);
          }
        }
      },
      onError: (error) => {
        setActive(-1);
        console.log(error);
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
      },
      networkMode: "always",
    });

  // ** Renders Chat
  const renderChats = () => {
    if (chats && chats.length) {
      if (query.length && !filteredChat?.length) {
        return (
          <span className="perfect-center">
            <img className="m-auto" src={no_result} width={100}/>
          </span>
        );
      } else {
        const arrToMap =
          query.length && filteredChat?.length ? filteredChat : chats;

        return arrToMap.map((item) => {
          const time = formatDateToMonthShort(
            item?.lastMessage ? item?.lastMessage.time : item.updated_at
          );

          return (
            <li
              key={item.id}
              onClick={() => active !== item.id && handleUserClick(item)}
              className={
                "mx-25 hoverEffectMsg " +
                classnames({
                  active: active === item.id,
                })
              }
            >
              <Avatar
                img={item?.display_avatar || avatar_blank}
                imgHeight="42"
                imgWidth="42"
                status={item.status}
                className="avatar"
              />
              <div className="chat-info d-flex flex-column flex-grow-1 ">
                <h5 className="mb-0 d-flex">{item?.display_name}</h5>
                <CardText
                  className="text-truncate"
                  dangerouslySetInnerHTML={{
                    __html:
                      item?.convo?.last_message_content ||
                      chats[chats.length - 1].message,
                  }}
                ></CardText>
              </div>
              <div className="chat-meta text-nowrap">
                <small className="float-end mb-25 chat-time ms-25">
                  {time}
                </small>
                {item?.unseenMsgs >= 1 ? (
                  <Badge className="float-end" color="danger" pill>
                    {item?.unseenMsgs}
                  </Badge>
                ) : null}
              </div>
            </li>
          );
        });
      }
    } else {
      return (
        <span className="perfect-center">
          <img src={no_result} width={100}/>
        </span>
      );
    }
  };

  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className="no-results show">
            <h6 className="mb-0">No Chats Found</h6>
          </li>
        );
      } else {
        const arrToMap =
          query.length && filteredContacts.length ? filteredContacts : contacts;
        return arrToMap.map((item) => {
          return (
            <li key={item.fullName} onClick={() => handleUserClick(item.id)}>
              <Avatar
                img={item.display_avatar || avatar_blank}
                imgHeight="42"
                imgWidth="42"
              />
              <div className="chat-info flex-grow-1">
                <h5 className="mb-0">{item.fullName}</h5>
                <CardText className="text-truncate">{item.about}</CardText>
              </div>
            </li>
          );
        });
      }
    } else {
      return null;
    }
  };

  // ** Handles Filter
  const handleFilter = (e) => {
    setQuery(e.target.value);
    const searchFilterFunction = (contact) =>
      contact.display_name.toLowerCase().includes(e.target.value.toLowerCase());
    const filteredChatsArr = chats.filter(searchFilterFunction);
    const filteredContactssArr = contacts.filter(searchFilterFunction);
    setFilteredChat([...filteredChatsArr]);
    setFilteredContacts([...filteredContactssArr]);
  };

  const renderAboutCount = () => {
    if (
      userProfile &&
      userProfile.about &&
      userProfile.about.length &&
      about.length === 0
    ) {
      return userProfile.about.length;
    } else {
      return about.length;
    }
  };

  const [searchInput, setSearchInput] = useState(false);

  return store ? (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames("chat-profile-sidebar", {
            show: userSidebarLeft,
          })}
        >
          <header className="chat-profile-header">
            <div className="close-icon" onClick={handleUserSidebarLeft}>
              <X size={14} color="primary" className="mb-1"/>
            </div>
            <div className="header-profile-sidebar">
              <Avatar
                className="box-shadow-1 avatar-border"
                img={userProfile.avatar || avatar_blank}
                status={status}
                size="xl"
              />
              <h4 className="chat-user-name">{userProfile.fullName}</h4>
              <span className="user-post">{userProfile.role}</span>
            </div>
          </header>
          <PerfectScrollbar
            className="profile-sidebar-area"
            options={{ wheelPropagation: false }}
          >
            <h6 className="section-label mb-1">About</h6>
            <div className="about-user">
              <Input
                rows="5"
                type="textarea"
                defaultValue={userProfile.about}
                onChange={(e) => setAbout(e.target.value)}
                className={classnames("char-textarea", {
                  "text-danger": about && about.length > 120,
                })}
              />
              <small className="counter-value float-end">
                <span className="char-count">{renderAboutCount()}</span> / 120
              </small>
            </div>
            <h6 className="section-label mb-1 mt-3">Status</h6>
            <ul className="list-unstyled user-status">
              <li className="pb-1">
                <div className="form-check form-check-success">
                  <Input
                    type="radio"
                    label="Online"
                    id="user-online"
                    checked={status === "online"}
                    onChange={() => setStatus("online")}
                  />
                  <Label className="form-check-label" for="user-online">
                    Online
                  </Label>
                </div>
              </li>
              <li className="pb-1">
                <div className="form-check form-check-danger">
                  <Input
                    type="radio"
                    id="user-busy"
                    label="Do Not Disturb"
                    checked={status === "busy"}
                    onChange={() => setStatus("busy")}
                  />
                  <Label className="form-check-label" for="user-busy">
                    Busy
                  </Label>
                </div>
              </li>
              <li className="pb-1">
                <div className="form-check form-check-warning">
                  <Input
                    type="radio"
                    label="Away"
                    id="user-away"
                    checked={status === "away"}
                    onChange={() => setStatus("away")}
                  />
                  <Label className="form-check-label" for="user-away">
                    Away
                  </Label>
                </div>
              </li>
              <li className="pb-1">
                <div className="form-check form-check-secondary">
                  <Input
                    type="radio"
                    label="Offline"
                    id="user-offline"
                    checked={status === "offline"}
                    onChange={() => setStatus("offline")}
                  />
                  <Label className="form-check-label" for="user-offline">
                    Offline
                  </Label>
                </div>
              </li>
            </ul>
            <h6 className="section-label mb-1 mt-2">Settings</h6>
            <ul className="list-unstyled">
              <li className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center">
                  <CheckSquare className="me-75" size="18" />
                  <span className="align-middle">Two-step Verification</span>
                </div>
                <div className="form-switch">
                  <Input
                    type="switch"
                    id="verification"
                    name="verification"
                    defaultChecked
                  />
                </div>
              </li>
              <li className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center">
                  <Bell className="me-75" size="18" />
                  <span className="align-middle">Notification</span>
                </div>
                <div className="form-switch">
                  <Input
                    type="switch"
                    id="notifications"
                    name="notifications"
                  />
                </div>
              </li>
              <li className="d-flex align-items-center cursor-pointer mb-1">
                <User className="me-75" size="18" />
                <span className="align-middle">Invite Friends</span>
              </li>
              <li className="d-flex align-items-center cursor-pointer">
                <Trash className="me-75" size="18" />
                <span className="align-middle">Delete Account</span>
              </li>
            </ul>
            <div className="mt-3">
              <Button color="primary">Logout</Button>
            </div>
          </PerfectScrollbar>
        </div>
        <div
          className={classnames("sidebar-content", {
            show: sidebar === true,
          })}
        >
          {props?.isLoading ? (
            <div style={{ height: "100%", paddingTop: "130px" }}>
              <div
                className="fallback-spinner app-loader"
                style={{ height: "35vh" }}
              >
                <div
                  className="loading"
                  style={{ width: "30px", height: "30px" }}
                >
                  <div
                    className="effect-1 effects"
                    style={{ width: "30px", height: "30px" }}
                  ></div>
                  <div
                    className="effect-2 effects"
                    style={{ width: "30px", height: "30px" }}
                  ></div>
                  <div
                    className="effect-3 effects"
                    style={{ width: "30px", height: "30px" }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="sidebar-close-icon p-0 px-50" onClick={handleSidebar}>
                {
                  !searchInput && <X className="mb-1 text-primary"/>}
              </div>
              <div className="chat-fixed-search d-flex align-items-center">
                <div className="d-flex align-items-center w-100">
                  <div
                    className="sidebar-profile-toggle"
                    onClick={handleUserSidebarLeft}
                  >
                    {/* {Object.keys(userProfile).length ? (
                  <Avatar
                    className="avatar-border"
                    img={userProfile.avatar || avatar_blank}
                    status={status}
                    imgHeight="42"
                    imgWidth="42"
                  />
                ) : null} */}
                  </div>
                  <div className="d-flex justify-content-between w-100">
                    <h4 className="page-title m-0">
                      {/* <MessageCircle size={24} />{" "} */}
                      <span className="text">Messages</span>
                    </h4>

                    <AnimatePresence>
                      {searchInput ? (
                        <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} // Initial state (hidden and scaled down)
                        animate={{ opacity: 1, scale: 1 }}    // Animation state (visible and at original scale)
                        exit={{ opacity: 0, scale: 0.8 }}     // Exit state (hidden and scaled down)
                        transition={{ duration: 0.3 }}       // Animation duration
                        className="search-input-wrapper"
                      >
                          <InputGroup className="input-group-merge ms-1 w-100" style={{zIndex: 100}}>
                            <InputGroupText>
                              <Search className="text-muted" size={18} />
                            </InputGroupText>
                            <Input
                              value={query}
                              placeholder="Search"
                              onChange={handleFilter}
                              onBlur={() => setSearchInput(query.length > 0)}
                              autoFocus
                            />
                            <InputGroupText>
                              <X className="cursor-pointer" size={14} onClick={() => {
                                setQuery("") 
                                setSearchInput(false)
                              }}/>
                            </InputGroupText>
                          </InputGroup>
                        </motion.div>
                      ): (
                        <>
                          <UncontrolledTooltip target={"search-chat-btn"} placement="top">
                            Search chats
                          </UncontrolledTooltip>
                          <Search
                            id="search-chat-btn"
                            className="text-primary cursor-pointer"
                            size={24}
                            onClick={() => setSearchInput(true)}
                          />
                        </>
                    )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <PerfectScrollbar
                className="chat-user-list-wrapper list-group"
                options={{ wheelPropagation: false }}
              >
                <ul className="chat-users-list chat-list media-list" style={{paddingTop: '2px'}}>
                  {renderChats()}
                </ul>
                {/* <h4 className="chat-list-title">Contacts</h4>
                    <ul className="chat-users-list contact-list media-list">
                    {renderContacts()}
                  </ul> */}
              </PerfectScrollbar>
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default SidebarLeft;
