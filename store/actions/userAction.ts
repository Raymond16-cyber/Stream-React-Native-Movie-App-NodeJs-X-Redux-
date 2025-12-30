import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL } from "./authAction";
import { CREATE_PROFILE_FAIL, CREATE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL, DELETE_PROFILE_SUCCESS, EDIT_NAME_FAIL, EDIT_NAME_SUCCESS, EDIT_PICTURE_FAIL, EDIT_PICTURE_SUCCESS } from "../types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = {
  _id: string;
  name: string;
  image?: string;
  isMain?: boolean;
  user?: string;
};


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



export const editPictureAction = (
  formData:any
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(
        `${baseURL}/api/me/edit-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await AsyncStorage.setItem("authToken", response.data.token);
      dispatch({
        type: EDIT_PICTURE_SUCCESS,
        payload: { user: response.data.user , image: response.data.user.image },
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
        type: EDIT_PICTURE_FAIL,
        payload: { error: errorMsg },
      });
    }
  };
};

// create profile action
export const createProfileAction = (
  profileData: { name: string; image?: string }
): ThunkAction<Promise<Profile>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/me/create-profile`,
        profileData,
        { withCredentials: true }
      );

      await AsyncStorage.setItem("authToken", response.data.token);

      dispatch({
        type: CREATE_PROFILE_SUCCESS,
        payload: {
          message: response.data.message,
          profiles: response.data.profiles,
          profile: response.data.profile,
        },
      });

      // ✅ THIS NOW MATCHES THE RETURN TYPE
      return response.data.profile;
    } catch (error) {
      let errorMsg = "An unknown error occurred";

      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }

      dispatch({
        type: CREATE_PROFILE_FAIL,
        payload: { error: errorMsg },
      });

      // 👇 important for TS: never resolve with undefined
      throw new Error(errorMsg);
    }
  };
};


export const editProfileImageAction = (
  formData: any,
  profileId: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(`${baseURL}/api/me/create-profile-image/${profileId}`, formData,{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      await AsyncStorage.setItem("authToken", response.data.token);
      }catch (error) {
      let errorMsg = "An unknown error occurred";
        if (axios.isAxiosError(error)) {
            errorMsg = 
              error.response?.data?.error ||
                error.response?.data?.message ||
                error.message;
        }
        // dispatch({
        //   type: EDIT_PICTURE_FAIL,
        //   payload: { error: errorMsg },
        // });
    }
  };
};

export const deleteProfileAction = (
  profileId: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => { 
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${baseURL}/api/me/delete-profile/${profileId}`,{
          withCredentials:true
        }
      );
      await AsyncStorage.setItem("authToken", response.data.token);
      dispatch({
        type: DELETE_PROFILE_SUCCESS,
        payload: {
          message: response.data.message,
          profiles: response.data.profiles,
          profileId: profileId,
        },
      });
    }catch(error){
      let errorMsg = "An unknown error occurred";
      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }
     dispatch({
        type: DELETE_PROFILE_FAIL,
        payload: { error: errorMsg },
      });
    }
  }}
