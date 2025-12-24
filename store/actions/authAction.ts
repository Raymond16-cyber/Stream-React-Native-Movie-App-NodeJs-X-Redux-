import { ThunkAction } from "redux-thunk";
import axios, { AxiosError } from "axios";
import { LOGIN_FAIL, LOGIN_SUCCESS, REGISTER_FAIL, REGISTER_SUCCESS } from "../types/type"
import { RootState } from "../store";
import { AnyAction } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://10.103.141.219:4000";

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
      console.log("Decoded Token:", decodedToken);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: { 
          user: decodedToken,
          token: response.data.token,
          message: response.data.message
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