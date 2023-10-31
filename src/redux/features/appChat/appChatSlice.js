import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserProfile = createAsyncThunk("appChat/getTasks", async () => {
  const response = await axios.get("/apps/chat/users/profile-user");
  return response.data;
});

export const selectChat = createAsyncThunk(
  "appChat/selectChat",
  async (id, { dispatch }) => {
    const response = await axios.get("/apps/chat/get-chat", { id });
    await dispatch(getChatContacts());
    return response.data;
  }
);

// export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj, { dispatch }) => {
//   const response = await axios.post('/apps/chat/send-msg', { obj })
//   await dispatch(selectChat(obj.contact.id))
//   return response.data
// })

export const appChatSlice = createSlice({
  name: "appChat",
  initialState: {
    chats: [],
    contacts: [],
    userProfile: {},
    selectedUser: {},
  },
  reducers: {
    replaceChats: (state, action) => {
      state.chats = action.payload;
    },
    selectChat: (state, action) => {
      state.selectedUser = action.payload;
    },
    sendMsg: (state, action) => {
      const user = JSON.parse(
        JSON.parse(localStorage.getItem("persist:root")).auth
      ).user;

      // Update the selected user's data with the new message
      state.selectedUser.data = [
        {
          content: action.payload.message,
          creator: {
            avatar_url: user?.avatar_url,
            full_name: user?.full_name,
            id: user?.id,
            __typename: user?.__typename,
          },
        },
        ...state.selectedUser.data,
      ];

      // Update the chats accordingly
      let newChat;
      state.chats = state.chats.filter((chat) => {
        if (chat.conversation_id === state.selectedUser.chat.conversation_id) {
          newChat = {
            ...chat,
            updated_at: Date.now(),
            convo: {
              ...chat.convo,
              last_message_content: action.payload.message,
            },
          };
          return false;
        }
        return true;
      });
      state.chats.unshift(newChat);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(selectChat.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export default appChatSlice.reducer;
