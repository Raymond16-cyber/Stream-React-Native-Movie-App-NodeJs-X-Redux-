import { CREATE_COMMUNITY_FAIL, CREATE_COMMUNITY_SUCCESS, FETCH_COMMUNITY_MESSAGES_FAIL, FETCH_COMMUNITY_MESSAGES_SUCCESS, FETCH_MY_COMMUNITIES_FAIL, FETCH_MY_COMMUNITIES_SUCCESS } from "../types/type";

type CommunityState = {
    myCommunities: Community[];
    successMessage: string;
    error: string;
};

const initialState: CommunityState = {
    myCommunities: [],
    successMessage: "",
    error: "",
};
export const communityReducer = (
    state = initialState,
    action: any
): CommunityState => {
    const { type, payload } = action;
    switch (type) {
        case FETCH_MY_COMMUNITIES_SUCCESS:
            return {
                ...state,
                myCommunities: payload,
            };
        case FETCH_MY_COMMUNITIES_FAIL:
            return {
                ...state,
                error: payload,
            };
        case FETCH_COMMUNITY_MESSAGES_SUCCESS:
            return {
                ...state,
                myCommunities: state.myCommunities.map((community) =>
                    community._id === payload.communityId
                        ? { ...community, messages: payload.messages }
                        : community
                ),
            };
       case "RECEIVED_SOCKET_MESSAGE":
  return {
    ...state,
    myCommunities: state.myCommunities.map((community) =>
      community._id === payload.communityId
        ? {
            ...community,
            messages: [
              ...(community.messages || []),
              payload.message,
            ],
          }
        : community
    ),
  };

        case FETCH_COMMUNITY_MESSAGES_FAIL:
            return {
                ...state,
                error:"unable to fetch messages",
                myCommunities: state.myCommunities.map((community) =>
                    community._id === payload.communityId
                        ? { ...community, messages: [] }
                        : community
                ),
            };
        case CREATE_COMMUNITY_SUCCESS:
            return {
                ...state,
                successMessage: payload.message,
                myCommunities: [...state.myCommunities, payload.community],
                error: "",
            };
        case CREATE_COMMUNITY_FAIL:
            return {
                ...state,
                error: payload.error,
            };
        
        default:
            return state;
    }
};