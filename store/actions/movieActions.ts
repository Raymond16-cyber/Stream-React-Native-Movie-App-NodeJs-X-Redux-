import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { AnyAction } from "redux";
import { baseURL, getAuthConfig } from "./authAction";
import axios from "axios";
import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE, FETCH_SAVED_MOVIES, FETCH_SAVED_MOVIES_FAIL, FETCH_TRENDING_MOVIES, FETCH_TRENDING_MOVIES_FAIL, REMOVE_SAVED_MOVIE, REMOVE_SAVED_MOVIE_FAIL, SAVE_MOVIE, SAVE_MOVIE_FAIL } from "../types/type";





export const incrementCountOrSaveSearchAction = (
query: string, movie: Movie,isKid:boolean
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${baseURL}/api/v1/increment-search-count`, {query,movie,isKid},{
        ...(await getAuthConfig())
      });

    } catch (error) {
      let errorMsg = "An unknown error occurred";

      if (axios.isAxiosError(error)) {
        errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
      }
    }
  };
};

export const removeSavedMovieAction = (
  movieId: number
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${baseURL}/api/v1/remove-saved-movie/${movieId}`,{
        ...(await getAuthConfig())
      });
      dispatch({
        type: REMOVE_SAVED_MOVIE,
        payload:{
            success: response.data.success,
            message:response.data.message,
            movieId:movieId
        }
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
        type: REMOVE_SAVED_MOVIE_FAIL,
        payload:{
            error:errorMsg
        }
      })
    }
  };
};


export const getTrendingMoviesAction = (isKid: boolean): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${baseURL}/api/v1/get-trending-movies/${isKid}`,{
        ...(await getAuthConfig())
      });
      dispatch({
        type: FETCH_TRENDING_MOVIES,
        payload:{
            data:response.data.movies
        }
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
        type: FETCH_TRENDING_MOVIES_FAIL,
        payload:{
            error:errorMsg
        }
      })
    }
  };
};

export const saveMovieAction = ({movie,userId,isKids}:{movie:MovieDetails,userId:string,isKids?:boolean}): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
return async (dispatch) => {
  try {
    const response = await axios.post(`${baseURL}/api/v1/save-movie`, {movie,userId,isKids},{
      ...(await getAuthConfig())
    });
    dispatch({
      type: SAVE_MOVIE,
      payload:{
        success: response.data.success,
        message:response.data.message,
        newMovie:response.data.data
      }
    })
          
  } catch (error) {
    let errorMsg = "An unknown error occurred";
    let errorStat = false;
          
    if (axios.isAxiosError(error)) {
        errorMsg =
           error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
        errorStat =
           error.response?.data?.success ||
          error.response?.data?.success
    }
    dispatch({
      type: SAVE_MOVIE_FAIL,
      payload:{
        success: errorStat,
        error:errorMsg
      }
    })
  }
};};

export const getSavedMoviesAction = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${baseURL}/api/v1/get-saved-movies`,{
        ...(await getAuthConfig())
      });
      dispatch({
        type:FETCH_SAVED_MOVIES,
        payload:{
            data:response.data.movies
        }
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
        type: FETCH_SAVED_MOVIES_FAIL,
        payload:{
            error:errorMsg
        }
      })
    }
  };
};

export const clearSuccessMessage = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
      dispatch({
        type:CLEAR_SUCCESS_MESSAGE,
      })
  };
};

export const clearErrorMessage = (): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
      dispatch({
        type:CLEAR_ERRORS,
      })
  };
};
