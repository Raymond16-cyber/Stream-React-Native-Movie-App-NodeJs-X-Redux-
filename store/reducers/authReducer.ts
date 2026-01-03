import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE, CREATE_PROFILE_FAIL, CREATE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL, DELETE_PROFILE_SUCCESS, EDIT_NAME_FAIL, EDIT_NAME_SUCCESS, EDIT_PICTURE_FAIL, EDIT_PICTURE_SUCCESS, LOAD_USER, LOAD_USER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, SET_SECURITY_PIN, SET_SECURITY_PIN_FAIL } from "../types/type";

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
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        error: payload.error,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        message: payload?.message

      }
    case LOGOUT_FAIL:
      return{
        ...state,
        error:payload.error
      }
    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user,
      };
    case LOAD_USER_FAIL:
      return{
        ...state,
        error:payload.error
      }
    case SET_SECURITY_PIN:
      return {
        ...state,
        message: payload.message,
        user:{
          ...state.user,
          securityPin: payload.pin
        },
      };
    case SET_SECURITY_PIN_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case EDIT_NAME_SUCCESS:
      return {
        ...state,
        user:{
          ...state.user,
          name: payload.user.name
        }
      };
    case EDIT_NAME_FAIL:
      return{
        ...state,
        error:payload.error
      }
    case  EDIT_PICTURE_SUCCESS:
      return {
        ...state,
        user:{
          ...state.user,
          image: payload.image
        },
      };
    case EDIT_PICTURE_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        user:{
          ...state.user,
          profiles: [
            ...state.user.profiles,
            payload.profile
          ]
        },
        message: payload.message,
      };
    case CREATE_PROFILE_FAIL:
      return{
        ...state,
        error: payload.error
      }
    case DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        user:{
          ...state.user,
          profiles: state.user.profiles.filter((profile: any) => profile._id !== payload.profileId)
        },
        message: payload.message,
      };
      case DELETE_PROFILE_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case CLEAR_SUCCESS_MESSAGE:
      return{
        ...state,
        message: "",
      } ;
    case CLEAR_ERRORS:
              return{
                ...state,
                error: "",
              }
    default:
      return state;
  }
};
