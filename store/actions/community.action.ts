import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL } from "./authAction";
import axios from "axios";
import { FETCH_MY_COMMUNITIES_FAIL, FETCH_MY_COMMUNITIES_SUCCESS } from "../types/type";



export const createCommunityAction = (
 formData: FormData
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    console.log("Creating community with data:", formData);
    const response = await axios.post(
  `${baseURL}/api/community/create`,
  formData,
  {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

    console.log("Create Community Response:", response.data);
  }}

  export const fetchMyCommunitiesAction = (): ThunkAction<
    Promise<void>,
    RootState,
    unknown,
    AnyAction
  > => {
    return async (dispatch) => {
        try {
        const response = await axios.get(`${baseURL}/api/community/my-communities`, {
          withCredentials: true,
        });
        dispatch({
          type: FETCH_MY_COMMUNITIES_SUCCESS,
          payload: response.data.communities,
        });
    }catch (error: any) {
        console.error("Error fetching communities:", error);
        const errorMessage = error.response?.data?.error || "Failed to fetch communities";
        dispatch({
          type: FETCH_MY_COMMUNITIES_FAIL,
          payload: errorMessage,
        });
      }
    };
    }