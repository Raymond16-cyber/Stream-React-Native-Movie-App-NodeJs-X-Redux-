import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { movieReducer } from "./movieReducer";
import { communityReducer } from "./community.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  movies:movieReducer,
  communities:communityReducer
});

export default rootReducer;
