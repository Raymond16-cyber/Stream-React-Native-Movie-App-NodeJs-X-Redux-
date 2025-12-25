import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { movieReducer } from "./movieReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  movies:movieReducer
});

export default rootReducer;
