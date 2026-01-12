import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL } from "./authAction";
import axios from "axios";
import { CREATE_COMMUNITY_FAIL, CREATE_COMMUNITY_SUCCESS, FETCH_COMMUNITY_MESSAGES_FAIL, FETCH_COMMUNITY_MESSAGES_SUCCESS, FETCH_MY_COMMUNITIES_FAIL, FETCH_MY_COMMUNITIES_SUCCESS } from "../types/type";



export const createCommunityAction = (
 formData: FormData
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
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
  dispatch({
    type: CREATE_COMMUNITY_SUCCESS,
    payload: {message: response.data.message, community: response.data.community},
  })
      
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
        ? error.response.data.error
        : "Failed to create community";
      console.error("Error creating community:", errorMessage);
      dispatch({        type: CREATE_COMMUNITY_FAIL,
        payload: {error: errorMessage, community: null},
      });
      
    }

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

export const sendCommunityMessageAction = (
  message : any
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try { 
      const response = await axios.post(
    `${baseURL}/api/community/send-message`,
    {message},
    {
      withCredentials: true,
    }
  );
    }catch{}}}

export const fetchCommunityMessagesAction = (
  communityId: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch)=>{
    try{
      const response = await axios.get(`${baseURL}/api/community/get-messages/${communityId}`,{
        withCredentials:true,
      }
      )
      dispatch({
        type: FETCH_COMMUNITY_MESSAGES_SUCCESS,
        payload: {
          communityId,
          messages: response.data.messages,
        },
      })

    }catch(error){
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.error
      ? error.response.data.error
      : "Failed to fetch community messages";
      console.error("Error fetching community messages:", errorMessage);
      dispatch({
        type: FETCH_COMMUNITY_MESSAGES_FAIL,
        payload: {
          communityId,
          messages: [],
        },
      })
    }
  }
}