// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import menuCollapsedReducer from "./features/menuCollapsed/menuCollapsedSlice";
import skinReducer from "./features/skin/skinSlice";
import appChatReducer from './features/appChat/appChatSlice';
import sessionReducer from './features/session/session';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  menuCollapsed: menuCollapsedReducer,
  skin: skinReducer,
  chat: appChatReducer,
  session: sessionReducer
})

export default rootReducer
