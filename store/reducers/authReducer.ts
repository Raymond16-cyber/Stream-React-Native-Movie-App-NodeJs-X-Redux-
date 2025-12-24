import { LOAD_USER, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../types/type";

type AuthState = {
  user: Record<string, any>;
  token: string;
  message: string;
  error: string;
  loading: boolean;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user:{},
  token: "",
  message: "",
  error: "",
  loading: false,
  isAuthenticated: false,
};

export const authReducer = (
  state = initialState,
  action: any
): AuthState => {
  const { type,payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        error: "",
      };

    case REGISTER_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
        message: payload.message,
      }
    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
        token: payload.token || "", // optional if you store token
      };


    default:
      return state;
  }
};
