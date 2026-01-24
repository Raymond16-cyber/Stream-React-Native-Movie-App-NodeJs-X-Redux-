import { CLEAR_ERRORS, CLEAR_SUCCESS_MESSAGE, FETCH_SAVED_MOVIES, FETCH_SAVED_MOVIES_FAIL, FETCH_TRENDING_MOVIES, FETCH_TRENDING_MOVIES_FAIL, REMOVE_SAVED_MOVIE, REMOVE_SAVED_MOVIE_FAIL, SAVE_MOVIE, SAVE_MOVIE_FAIL } from "../types/type";

type MovieState = {
  trendingMovies: [],
  savedMovies: SavedMovie[],
  message: string;
  error: string;
  loading: boolean;
  savedStatus:boolean
};

const initialState: MovieState = {
  trendingMovies: [],
  savedMovies: [],
  message: "",
  error: "",
  loading: true,
  savedStatus:false
};

export const movieReducer = (
  state = initialState,
  action: any
): MovieState => {
  const { type,payload } = action;
  switch (type) {
    case FETCH_TRENDING_MOVIES:
        return{
            ...state,
            loading: false,
            trendingMovies:payload.data
        }
    case FETCH_TRENDING_MOVIES_FAIL:
        return{
            ...state,
            error:payload.error
        }
      case SAVE_MOVIE:
        return{
          ...state,
          savedStatus: true,
          message:payload.message,
          savedMovies: [
            ...state.savedMovies,payload.newMovie
          ]
        }
        case SAVE_MOVIE_FAIL:
          return{
            ...state,
            savedStatus: false,
            error:payload.error
          }
        case REMOVE_SAVED_MOVIE:
          return{
            ...state,
            savedStatus: true,
            message:payload.message,
            savedMovies: state.savedMovies.filter(
              (movie) => movie.movie_id !== payload.movieId
            )
        }
        case REMOVE_SAVED_MOVIE_FAIL:
          return{
            ...state,
            savedStatus: false,
            error:payload.error
        }
        case FETCH_SAVED_MOVIES:
          return{
            ...state,
            loading: false,
            savedMovies:payload.data
        }
        case FETCH_SAVED_MOVIES_FAIL:
          return{
            ...state,
            error:payload.error
        }

        case CLEAR_SUCCESS_MESSAGE:
          return{
            ...state,
            message: "",
          }
          case CLEAR_ERRORS:
          return{
            ...state,
            error: "",
          }

          
    default:
       return state
  }
}