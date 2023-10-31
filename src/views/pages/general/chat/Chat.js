// ** React Imports
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
// import { sendMsg } from "../../../../redux/features/appChat/appChatSlice";
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  MessageSquare,
  Menu,
  PhoneCall,
  Video,
  Search,
  MoreVertical,
  Mic,
  Image,
  Send,
  FileText,
  ChevronUp,
  ChevronDown,
  Voicemail,
  File,
  Paperclip,
} from "react-feather";

// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Button,
  InputGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  InputGroupText,
  UncontrolledDropdown,
  Badge,
  UncontrolledTooltip,
  Tooltip,
} from "reactstrap";
import moment from "moment/moment";

import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { isArray, isString } from "lodash";
import { appChatSlice } from "../../../../redux/features/appChat/appChatSlice";
import { chatService } from "../../../../services/chatService";
import { motion } from "framer-motion";
import avatar_blank from "../../../../assets/images/avatars/avatar-blank.png";

const ChatLog = (props) => {
  // ** Props & Store
  const {
    handleUser,
    handleUserSidebarRight,
    handleSidebar,
    store,
    userSidebarLeft,
  } = props;
  const { userProfile, selectedUser } = store;

  // ** Refs & Dispatch
  const chatArea = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // ** State
  const [msgValue, setMsgValue] = useState(EditorState.createEmpty());
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [group, setGroup] = useState(false);

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current);
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    // Handle the image upload here
  };

  const handleDocumentUpload = (e) => {
    const documentFile = e.target.files[0];
    // Handle the document upload here
  };

  const handleVideoUpload = (e) => {
    const videoFile = e.target.files[0];
    // Handle the video upload here
  };

  // ** If user chat is not empty scrollToBottom
  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length;
    if (selectedUserLen) {
      scrollToBottom();
    }
    if (selectedUser?.chat?.convo?.conversation_memberships_count > 2) {
      setGroup(true);
    }
  }, [selectedUser]);

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog = [];
    if (selectedUser?.data) {
      chatLog = [
        ...selectedUser?.data,
        {
          id: "16953606",
          content: "<p>how</p>\n",
          user_id: "2350246",
          conversation_id: "4188751",
          attached_image_url: null,
          attached_audio_url: null,
          document_id: null,
          created_at: "2023-10-04 10:59:22 +0000",
          updated_at: "2023-10-04 10:59:22 +0000",
          is_autoresponse: false,
          deleted_by_user: false,
          scheduled_at: null,
          image_name: null,
          document_name: null,
          on_behalf_user: null,
          creator: {
            id: "235asd6",
            full_name: "Farhan Alia",
            avatar_url:
              "https://s3.amazonaws.com/healthie-production/image/2350246/medium/data?1696406815",
            is_patient: true,
            first_name_last_initial: "Farhan A",
            __typename: "User",
          },
          task: null,
          __typename: "Note",
        },
        {
          id: "16953606",
          content: "<p>how</p>\n",
          user_id: "2350246",
          conversation_id: "4188751",
          attached_image_url: null,
          attached_audio_url: null,
          document_id: null,
          created_at: "2023-10-04 10:59:22 +0000",
          updated_at: "2023-10-04 10:59:22 +0000",
          is_autoresponse: false,
          deleted_by_user: false,
          scheduled_at: null,
          image_name: null,
          document_name: null,
          on_behalf_user: null,
          creator: {
            id: "235asd6",
            full_name: "Farhan Alia",
            avatar_url:
              "https://s3.amazonaws.com/healthie-production/image/2350246/medium/data?1696406815",
            is_patient: true,
            first_name_last_initial: "Farhan A",
            __typename: "User",
          },
          task: null,
          __typename: "Note",
        },
        {
          id: "16953606",
          content: "<p>how</p>\n",
          user_id: "2350246",
          conversation_id: "4188751",
          attached_image_url: null,
          attached_audio_url: null,
          document_id: null,
          created_at: "2023-10-04 10:59:22 +0000",
          updated_at: "2023-10-04 10:59:22 +0000",
          is_autoresponse: false,
          deleted_by_user: false,
          scheduled_at: null,
          image_name: null,
          document_name: null,
          on_behalf_user: null,
          creator: {
            id: "235asd6",
            full_name: "Farhan Alia",
            avatar_url:
              "https://s3.amazonaws.com/healthie-production/image/2350246/medium/data?1696406815",
            is_patient: true,
            first_name_last_initial: "Farhan A",
            __typename: "User",
          },
          task: null,
          __typename: "Note",
        },
      ]?.reverse();
    }

    const formattedChatLog = [];
    let chatMessageSenderId = chatLog[0] ? chatLog[0]?.creator?.id : undefined;
    let id = chatLog[0] ? chatLog[0]?.id : undefined;
    let fullName = chatLog[0] ? chatLog[0]?.creator?.full_name : undefined;
    let avatar = chatLog[0] ? chatLog[0]?.creator?.avatar_url : undefined;
    let role = chatLog[0] ? chatLog[0]?.creator?.__typename : undefined;
    let about = chatLog[0] ? chatLog[0]?.about : undefined;
    let msgGroup = {
      senderId: chatMessageSenderId,
      id,
      fullName,
      avatar,
      role,
      about,
      messages: [],
    };
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg?.creator?.id) {
        msgGroup.messages.push({
          msg: msg?.content,
          time: msg?.created_at?.toString(),
        });
      } else {
        chatMessageSenderId = msg?.creator?.id;
        formattedChatLog.push(msgGroup);
        msgGroup = {
          senderId: msg?.creator?.id,
          id: msg?.id,
          fullName: msg?.creator?.full_name,
          avatar: msg?.creator?.avatar_url,
          role: msg?.creator?.__typename,
          about: msg?.creator?.__typename,
          messages: [
            {
              msg: msg?.content,
              time: msg?.created_at?.toString(),
            },
          ],
        };
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
    });
    return formattedChatLog;
  };

  const renderPastChatBadge = (chat) => {
    if (
      localStorage.getItem("prevDate") ==
      moment(chat.time).format("ddd D, YYYY")
    ) {
      return <></>;
    }

    localStorage.setItem("prevDate", moment(chat.time).format("ddd D, YYYY"));

    const dateInput = moment(chat.time);
    const today = moment();
    let text = "";
    // Compare the input date with today's date
    if (dateInput.isSame(today, "day")) {
      text = "Today";
    } else if (today.clone().subtract(1, "day").isSame(dateInput, "day")) {
      text = "Yesterday";
    } else {
      text = dateInput.format("dddd MMMM D, YYYY");
    }
    return (
      <div
        key={chat.msg}
        className="chat-content time-badge d-flex justify-content-center"
        style={{ background: "transparent", marginBottom: "40px" }}
      >
        <Badge
          color=""
          className="fw-500"
          style={{
            color: "gray",
            position: "absolute",
            left: "40%",
            right: "40%",
            fontWeight: "500",
          }}
        >
          {text}
        </Badge>
      </div>
    );
  };
  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      console.log(item, user?.id);
      return (
        <div
          key={index}
          className={classnames("chat ", {
            "chat-left": item.senderId !== user?.id,
          })}
        >
          <div className="chat-avatar" style={{ position: "relative" }}>
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className="box-shadow-1 cursor-pointer"
              // img={item.senderId === user?.id ? userProfile.avatar : item.avatar}
              img={item.avatar || avatar_blank}
              style={{
                position: "absolute",
                right: item.senderId === user?.id ? "20px" : "",
                left: item.senderId !== user?.id ? "15px" : "",
              }}
            />
            <pre
              className="msg-sender"
              style={{
                position: "absolute",
                top: "10px",
                right: item.senderId === user?.id ? "62px" : "",
                left: item.senderId !== user?.id ? "55px" : "",
              }}
            >
              {item.senderId !== user?.id ? item.fullName : "You"}
            </pre>
          </div>

          <div className="chat-body m-0">
            {item.messages.map((chat, index) => (
              <div key={"msg" + index}>
                {renderPastChatBadge(chat)}
                <div
                  key={"msg" + index}
                  className={`chat-content ${
                    item.senderId === user?.id
                      ? "rounded-top-right"
                      : "rounded-top-Left"
                  }`}
                >
                  {/* {group && (
                    <p className="msg-sender">
                      {item.senderId !== user?.id ? item.fullName : "You"}
                    </p>
                  )} */}
                  <p dangerouslySetInnerHTML={{ __html: chat.msg }} />
                  <small className="text-muted ms-auto">
                    {moment(chat.time).format("hh:mm A")}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };
  // ** Opens right sidebar & handles its data
  const handleAvatarClick = (obj) => {
    handleUserSidebarRight();
    handleUser(obj);
  };

  // ** On mobile screen open left sidebar on Start Conversation Click
  const handleStartConversation = () => {
    if (
      !Object.keys(selectedUser).length &&
      !userSidebarLeft &&
      window.innerWidth < 992
    ) {
      handleSidebar();
    }
  };

  // ** Sends New Msg
  const handleSendMsg = () => {
    const contentState = msgValue.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    // Convert the EditorState to HTML
    const htmlContent = draftToHtml(rawContentState);

    if (htmlContent.trim().length > 0) {
      dispatch(
        appChatSlice.actions.sendMsg({
          message: htmlContent, // Use the HTML content here
        })
      );
      setMsgValue(EditorState.createEmpty());
      const messageData = {
        conversation_id: selectedUser.chat.conversation_id,
        org_chat: false,
        content: htmlContent, // Use the HTML content here
      };
      sendMessage(messageData);
    }
  };

  //send Message
  const { mutate: sendMessage, isLoading: isSending } = chatService.sendMessage(
    {
      onSuccess: async (response) => {
        // console.log(response);
        if (response?.data?.success == true) {
          const data = {
            conversation_id: selectedUser.chat.conversation_id,
            org_chat: false,
            scheduled_notes: false,
            sort_by: "created_at_desc",
            offset: 0,
          };
          reloadChat(data);
        } else {
          setActive(-1);
          const errs = response.data.result;
          if (errs?.length > 0 && !isString(errs)) {
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
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
      },
      networkMode: "always",
    }
  );

  //Reload Chat
  const { mutate: reloadChat, isLoading: isReloading } =
    chatService.getChatById({
      onSuccess: async (response) => {
        // console.log(response);
        if (response?.data?.success == true) {
          if (
            selectedUser.chat.conversation_id ===
            JSON.parse(response?.config?.data)?.conversation_id
          ) {
            dispatch(
              appChatSlice.actions.selectChat({
                chat: selectedUser.chat,
                data: response?.data?.result?.notes,
                loading: false,
              })
            );
          }
        } else {
          setActive(-1);
          const errs = response.data.result;
          if (errs?.length > 0 && !isString(errs)) {
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
        SweetAlert(
          "error",
          error?.response?.data?.message ||
            error?.response?.data?.title ||
            error?.message
        );
      },
      networkMode: "always",
    });

  // ** ChatWrapper tag based on chat's length
  const ChatWrapper =
    Object.keys(selectedUser).length && selectedUser.chat
      ? PerfectScrollbar
      : "div";

  selectedUser.loading;
  useEffect(() => {
    setMsgValue("");
  }, [selectedUser.loading]);

  return (
    <div className="chat-app-window">
      <div
        className={classnames("start-chat-area", {
          "d-none": selectedUser.chat,
        })}
      >
        <div className="start-chat-icon mb-1 bg-primary text-white">
          <MessageSquare />
        </div>
        <h4
          className="sidebar-toggle start-chat-text bg-primary text-white"
          onClick={handleStartConversation}
        >
          Start Conversation
        </h4>
      </div>
      {Object.keys(selectedUser).length ? (
        <div
          className={classnames(
            "active-chat d-flex flex-column justify-content-between",
            {
              "d-none": selectedUser === null,
            }
          )}
        >
          <div className="chat-navbar">
            <header className="chat-header ">
              <div className="d-flex align-items-center">
                <div
                  className="sidebar-toggle d-block d-lg-none me-1 cursor-pointer"
                  onClick={handleSidebar}
                >
                  <Menu size={21} color="gray" />
                </div>
                <Avatar
                  imgHeight="44"
                  imgWidth="44"
                  img={selectedUser?.chat?.display_avatar || avatar_blank}
                  status={selectedUser?.chat?.status}
                  className="avatar-border user-profile-toggle m-0 me-1"
                />
                <h6 className="mb-0">{selectedUser?.chat?.display_name}</h6>
              </div>
              {/* <div className="d-flex align-items-center">
                <PhoneCall
                  size={18}
                  className="cursor-pointer d-sm-block d-none me-1"
                />
                <Video
                  size={18}
                  className="cursor-pointer d-sm-block d-none me-1"
                />
                <Search
                  size={18}
                  className="cursor-pointer d-sm-block d-none"
                />
                <UncontrolledDropdown className="more-options-dropdown">
                  <DropdownToggle
                    className="btn-icon"
                    color="transparent"
                    size="sm"
                  >
                    <MoreVertical size="18" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      View Contact
                    </DropdownItem>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      Mute Notifications
                    </DropdownItem>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      Block Contact
                    </DropdownItem>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      Clear Chat
                    </DropdownItem>
                    <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
                      Report
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div> */}
            </header>
          </div>

          <ChatWrapper
            ref={chatArea}
            className={`user-chats ${selectedUser.loading && "full-height"}`}
            options={{ wheelPropagation: false }}
          >
            {selectedUser.chat ? (
              selectedUser.loading === true ? (
                <div
                  className="fallback-spinner app-loader"
                  style={{ height: "100%" }}
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
              ) : (
                <div className="chats">{renderChats()}</div>
              )
            ) : null}
          </ChatWrapper>
          {!selectedUser.loading && (
            <motion.div
              initial={{ y: 100 }} // Initial state (hidden below)
              animate={{ y: 0 }} // Animation state (visible at its original position)
              exit={{ y: 100 }} // Exit state (hidden below)
              transition={{ duration: 0.5 }} // Animation duration
            >
              <Form
                className="chat-app-form position-relative"
                onKeyDown={(e) => {
                  if (e.key == "Enter" && e.ctrlKey) {
                    !selectedUser.loading && handleSendMsg();
                  }
                }}
              >
                {
                  <div className="border-bottom d-flex bg-white justify-content-between pt-25 px-1">
                    <div>
                      <UncontrolledTooltip
                        target={"options-btn"}
                        placement="top"
                      >
                        Formating Options
                      </UncontrolledTooltip>
                      <span
                        className="cursor-pointer"
                        id={"options-btn"}
                        onClick={() => setToolbarVisible(!toolbarVisible)}
                      >
                        {toolbarVisible ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronUp size={18} />
                        )}
                      </span>
                    </div>
                  </div>
                }
                <div
                  className="chat-editor-container"
                  style={{ opacity: selectedUser.loading ? "0.3" : "1" }}
                >
                  <Editor
                    toolbarHidden={!toolbarVisible}
                    editorState={msgValue}
                    onEditorStateChange={(data) =>
                      !selectedUser.loading && setMsgValue(data)
                    }
                    placeholder="Type your message here... (CTRL + Enter to send message)"
                  />
                </div>
                <div className="send d-flex align-items-center send-msg-opt">
                  <div className="d-flex gap-1 py-25">
                    <label
                      htmlFor="image-upload"
                      className="upload-button"
                      role="button"
                      id="u-img-btn"
                    >
                      <Paperclip size={17} className="" style={{color:"gray"}} />
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                      <UncontrolledTooltip target={"u-img-btn"} placement="top">
                        Upload Image
                      </UncontrolledTooltip>
                    </label>

                    <label
                      htmlFor="document-upload"
                      className="upload-button"
                      role="button"
                      id="u-doc-btn"
                    >
                      <Mic size={17} className=""  style={{color:"gray"}}/>
                      <input
                        type="file"
                        id="document-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleDocumentUpload}
                        style={{ display: "none" }}
                      />
                      <UncontrolledTooltip target={"u-doc-btn"} placement="top">
                        Upload Document
                      </UncontrolledTooltip>
                    </label>
                  </div>
                </div>
                <UncontrolledTooltip
                  target={"send-btn"}
                  placement="top"
                  delay={1}
                >
                  Press <code>CTRL + Enter</code> to send message
                </UncontrolledTooltip>
                <Button
                  id={"send-btn"}
                  className="send d-flex align-items-center send-msg-btn"
                  color="primary"
                  size="sm"
                  disabled={selectedUser.loading}
                  onClick={() => {
                    !selectedUser.loading && handleSendMsg();
                  }}
                >
                  <Send size={14} />
                  {/* <span className="d-sm-none d-md-none"> Send</span> */}
                </Button>
              </Form>
            </motion.div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ChatLog;
