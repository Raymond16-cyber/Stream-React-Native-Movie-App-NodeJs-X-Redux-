import { FETCH_MY_COMMUNITIES_FAIL, FETCH_MY_COMMUNITIES_SUCCESS } from "../types/type";

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
        default:
            return state;
    }
};