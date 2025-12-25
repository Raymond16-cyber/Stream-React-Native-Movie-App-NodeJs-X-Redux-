import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL } from "./authAction";
import { EDIT_NAME_FAIL, EDIT_NAME_SUCCESS } from "../types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const editNameAction = (
  { name }: { name: string }
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
        const response = await axios.put(`${baseURL}/api/me/edit-name`, { name },{
            withCredentials:true
        });
        await AsyncStorage.setItem("authToken", response.data.token);
        dispatch({
        type: EDIT_NAME_SUCCESS,
        payload: { 
            message: response.data.message,
            user: response.data.user
         },
        })
    }catch (error) {
      let errorMsg = "An unknown error occurred";
        if (axios.isAxiosError(error)) {
            errorMsg = 
              error.response?.data?.error ||   
                error.response?.data?.message ||
                error.message;
        }
        dispatch({
          type: EDIT_NAME_FAIL,
          payload: { error: errorMsg },
        });
    }
    };
    };