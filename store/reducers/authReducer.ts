import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE, CREATE_PROFILE_FAIL, CREATE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL, DELETE_PROFILE_SUCCESS,  EDIT_USER_SUCCESS,  LOAD_USER, LOAD_USER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, SET_CURRENT_PROFILE_FAIL, SET_CURRENT_PROFILE_SUCCESS, SET_SECURITY_PIN, SET_SECURITY_PIN_FAIL, TOGGLE_MULTI_PROFILE, TOGGLE_MULTI_PROFILE_FAIL } from "../types/type";

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
        user: {...payload.user,currentProfile: payload.currentProfile},
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
   case EDIT_USER_SUCCESS:
    return{
      ...state,
      message:payload.message,
      user:{
        ...state.user,
        name: payload.user.name,
        image:payload.user.image,
        currentProfile: payload.profile,
        profiles: state.user.profiles.map((profile: any) =>
          profile._id === payload.profile._id ? payload.profile : profile
        ),
      }
    }
    case TOGGLE_MULTI_PROFILE:
      return{
        ...state,
        user:{
          ...state.user,
          isMultiProfileEnabled: payload.isMultiProfileEnabled,
        },
        message: payload.message,
      };
    case TOGGLE_MULTI_PROFILE_FAIL:
      return{
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
    case SET_CURRENT_PROFILE_SUCCESS:
      return{
        ...state,
        user:{
          ...state.user,
          currentProfile: payload.currentProfile,
        },
        message: payload.message,
      };
    case SET_CURRENT_PROFILE_FAIL:
      return{
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
