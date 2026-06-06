import { ThunkAction } from "redux-thunk";
import axios, { AxiosError } from "axios";
import { AUTH_DESTROY_ACCOUNT, AUTH_DESTROY_ACCOUNT_FAIL, AUTH_ERROR, LOAD_USER, LOAD_USER_START, LOAD_USER_FAIL, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS, SET_SECURITY_PIN, SET_SECURITY_PIN_FAIL } from "../types/type"
import { RootState } from "../store";
import { AnyAction } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const baseURL = "https://stream-server-4tle.onrender.com";

type regData = {
      email: string,
      password: string,
      name: string,
    };


export const registerAction = (
  data: regData
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      await axios.post(`${baseURL}/api/auth/register`, data);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: { error: "" },
      });
    } catch (error) {
      let errorMsg = "An unknown error occurred";

      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }

      dispatch({
        type: REGISTER_FAIL,
        payload: { error: errorMsg },
      });
    }
  };
};

export const loginAction = (
  data: { email: string; password: string }
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, data,{
        withCredentials: true,
      });
      AsyncStorage.setItem("authToken", response.data.token);
      const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
      if(decodedToken.startedAt){
        AsyncStorage.setItem("startedAt", decodedToken.startedAt);
      }
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { 
          user: decodedToken,
          token: response.data.token,
          message: response.data.message,
         },
      });
    } catch (error) {
      let errorMsg = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }
      dispatch({
        type: LOGIN_FAIL,
        payload: { error: errorMsg },
      });
    }
  };
};


export const LogoutAction = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem("authToken"); 
      const store = await AsyncStorage.getAllKeys();
      console.log("Cleared AsyncStorage keys:", store);
      dispatch({
        type: LOGOUT_SUCCESS,
        payload: { 
          message: "Logout successful",
          error: "" 
        },
      });
    } catch (error) {
      console.warn("Logout failed", error);
      dispatch({
        type: LOGOUT_FAIL,
        payload: { 
          error: "Logout failed" 
        },
      });
    }
  };
};

export const authForgetPasswordAction = (
  email: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => { 
  return async (dispatch) => {
    try {
      console.log("Forgot password action triggered for email:", email);
      const response = await axios.post(`${baseURL}/api/auth/forgot-password`, { email });
    }catch (error) {}
  }
};

export const destroyAccountAction = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");
      const response = await axios.delete(`${baseURL}/api/auth/destroy-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      await AsyncStorage.removeItem("authToken");
      dispatch({
        type: AUTH_DESTROY_ACCOUNT,
        payload: { 
          message: response.data.message,
        },
      })
    }catch (error) {
      console.warn("Account deletion failed", error);
      let errorMsg = "Account deletion failed";
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }
      dispatch({
        type: AUTH_DESTROY_ACCOUNT_FAIL,
        payload: { 
          error: errorMsg 
        },
      })
    }
  };
}

export const loadUserAction = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      // Dispatch loading state
      dispatch({
        type: LOAD_USER_START,
      });

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        console.warn("❌ No token available for load-user request");
        dispatch({
          type: LOAD_USER_FAIL,
          payload: { 
            error: "No authentication token" 
          },
        });
        return;
      }

      // Set 10-second timeout to prevent indefinite waiting
      const response = await Promise.race([
        axios.get(`${baseURL}/api/auth/load-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true 
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000))
      ]) as any;
      
      console.log("✅ Backend response:", response.data);
      
      await AsyncStorage.setItem("authToken", response.data.token);
      dispatch({
        type: LOAD_USER,
        payload: { 
          message: "User loaded successfully",
          user: response.data.user, 
          currentProfile: response.data.currentProfile,
          pin: response.data.user.securityPin || "",
        },
      });
    } catch (error) {
      console.warn("❌ Load user failed", error);
      dispatch({
        type: LOAD_USER_FAIL,
        payload: { 
          error: "Load user failed" 
        },
      });
    }
  };
};

export const createSecurityPinAction = (
  pin: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/create-security-pin`, { securityPin:pin },{
        withCredentials: true,
      });
      await AsyncStorage.setItem("authToken", response.data.token);
      dispatch({
        type: SET_SECURITY_PIN,
        payload: { 
          message: response.data.message,
          pin
         },
      })
    } catch (error) {
      let errorMsg = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }
      dispatch({
        type: SET_SECURITY_PIN_FAIL,
        payload: { error: errorMsg },
      });
    }
  };
}