import { combineReducers } from "redux";
import { authReducer } from "./authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  // user: userReducer,
  // chat: chatReducer,
});

export default rootReducer;
