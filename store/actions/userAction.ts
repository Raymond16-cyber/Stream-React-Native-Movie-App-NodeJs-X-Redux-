import axios from "axios";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL } from "./authAction";
import { CREATE_PROFILE_FAIL, CREATE_PROFILE_SUCCESS, DELETE_PROFILE_FAIL, DELETE_PROFILE_SUCCESS, EDIT_USER_FAIL, EDIT_USER_SUCCESS, SET_CURRENT_PROFILE_FAIL, SET_CURRENT_PROFILE_SUCCESS, TOGGLE_MULTI_PROFILE } from "../types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = {
  _id: string;
  name: string;
  image?: string;
  isMain?: boolean;
  user?: string;
};


// create profile action
export const editUserDetailsAction = (
  data: FormData
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${baseURL}/api/me/edit-user-details`,
        data,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ store new token
      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
      }

      dispatch({
        type: EDIT_USER_SUCCESS,
        payload: {
          message: response.data.message,
          user: response.data.user,
          profile: response.data.profile,
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
        type: EDIT_USER_FAIL,
        payload: { error: errorMsg },
      });
    }
  };
};

export const toggleMultiProfileAction = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/me/toggle-multi-profile`,{
          withCredentials:true
        }
      );
      await AsyncStorage.setItem("authToken", response.data.token);
      dispatch({
        type: TOGGLE_MULTI_PROFILE,
        payload: {
          isMultiProfileEnabled: response.data.isMultiProfileEnabled,
          message: response.data.message,
        },
      })
    }catch(error){
      console.warn("Toggle multi-profile failed", error);
    }
  };
};

// create profile action
export const createProfileAction = (
  profileData: FormData
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
  `${baseURL}/api/me/create-profile`,
  profileData,
  {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
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

  export const switchProfileAction = ({
    profileId
  }: {profileId: string}): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => { 
    return async (dispatch) => {
      try {
        const response = await axios.put(
          `${baseURL}/api/me/switch-profile`,{profileId},{
            withCredentials:true}
        );
        await AsyncStorage.setItem("authToken", response.data.token);
        dispatch({
          type: SET_CURRENT_PROFILE_SUCCESS,
          payload: {
            message: response.data.message,
            currentProfile: response.data.currentProfile,
          },
        })
      }catch(error){
        let errorMsg = "An unknown error occurred";
        if (axios.isAxiosError(error)) {
          errorMsg =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message;
        }
        dispatch({
          type:SET_CURRENT_PROFILE_FAIL,
          payload: { error: errorMsg },
        });
      }
    }}
