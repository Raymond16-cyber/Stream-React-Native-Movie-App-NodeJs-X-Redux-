import {
  CREATE_COMMUNITY_FAIL,
  CREATE_COMMUNITY_SUCCESS,
  FETCH_COMMUNITY_MESSAGES_FAIL,
  FETCH_COMMUNITY_MESSAGES_SUCCESS,
  FETCH_LAST_COMMUNITY_MESSAGE_FAIL,
  FETCH_LAST_COMMUNITY_MESSAGE_SUCCESS,
  FETCH_MY_COMMUNITIES_FAIL,
  FETCH_MY_COMMUNITIES_SUCCESS,
  READ_COMMUNITY_MESSAGES_FAIL,
  READ_COMMUNITY_MESSAGES_SUCCESS,
  SEND_COMMUNITY_MESSAGE_FAIL,
  SEND_COMMUNITY_MESSAGE_SUCCESS,
} from "../types/type";

type CommunityState = {
  myCommunities: Community[];
  loadingCommunityMessages: boolean; // always defined
  successMessage: string;
  error: string;
};

const initialState: CommunityState = {
  myCommunities: [],
  loadingCommunityMessages: false,
  successMessage: "",
  error: "",
};

export const communityReducer = (
  state = initialState,
  action: any
): CommunityState => {
  const { type, payload } = action;

  switch (type) {
    // --- Fetch my communities ---
    case FETCH_MY_COMMUNITIES_SUCCESS:
      return {
        ...state,
        myCommunities: payload,
        loadingCommunityMessages: false,
      };

    case FETCH_MY_COMMUNITIES_FAIL:
      return {
        ...state,
        error: payload,
        loadingCommunityMessages: false,
      };

    // --- Fetch community messages ---
    case "FETCH_COMMUNITY_MESSAGES_REQUEST":
      return {
        ...state,
        loadingCommunityMessages: true, // start loader
      };

    case FETCH_COMMUNITY_MESSAGES_SUCCESS:
      return {
        ...state,
        myCommunities: state.myCommunities.map((community) =>
          community._id === payload.communityId
            ? { 
                ...community, 
                messages: payload.messages,
                lastMessage: payload.messages.length > 0 ? {
                  content: payload.messages[payload.messages.length - 1].content,
                  senderName: payload.messages[payload.messages.length - 1].senderName,
                  senderImage: payload.messages[payload.messages.length - 1].senderImage,
                } : community.lastMessage,
                lastMessageSender: payload.messages.length > 0 ? payload.messages[payload.messages.length - 1].senderId : community.lastMessageSender,
                lastMessageTime: payload.messages.length > 0 ? new Date(payload.messages[payload.messages.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : community.lastMessageTime,
              }
            : community
        ),
        loadingCommunityMessages: false, // stop loader
      };

    case FETCH_COMMUNITY_MESSAGES_FAIL:
      return {
        ...state,
        error: payload || "Unable to fetch messages",
        myCommunities: state.myCommunities.map((community) =>
          community._id === payload.communityId
            ? { ...community, messages: [] }
            : community
        ),
        loadingCommunityMessages: false, // stop loader
      };
    case FETCH_LAST_COMMUNITY_MESSAGE_SUCCESS:
      return{
        ...state,
        myCommunities: state.myCommunities.map((community) =>
          community._id === payload.communityId 
            ? {
                ...community,
                lastMessage: payload.lastMessage,
              }
            : community
        ),
      };
    case FETCH_LAST_COMMUNITY_MESSAGE_FAIL:
      return{
        ...state,
        error: payload.error || "Unable to fetch last message",
      }
    // --- Send community message ---
      case SEND_COMMUNITY_MESSAGE_SUCCESS:
          return{
            ...state,
            myCommunities: state.myCommunities.map((community) => {
              if (community._id !== payload.message.communityId) return community;

              const existing = (community.messages || []).some((m) =>
                m._id === payload.message._id ||
                m._id === payload.message.id ||
                m.id === payload.message._id
              );

              const nextMessages = existing
                ? community.messages || []
                : [...(community.messages || []), payload.message];

              return {
                ...community,
                messages: nextMessages,
                lastMessage: {
                  content: payload.message.content,
                  senderName: payload.message.senderName,
                  senderImage: payload.message.senderImage,
                },
                lastMessageSender: payload.message.senderId,
                lastMessageTime: new Date().toISOString(),
              };
            }),
          loadingCommunityMessages: false,
          error: "",
        };
    case SEND_COMMUNITY_MESSAGE_FAIL:
      return{
        ...state,
        error: payload.error || "Unable to send message",
        loadingCommunityMessages: false,
      }
    case READ_COMMUNITY_MESSAGES_SUCCESS:
      return {
        ...state,
        myCommunities: state.myCommunities.map((community) =>
          community._id === payload.communityId
            ? {
                ...community,
                messages: (community.messages || []).map((message) =>
                  message.readBy?.includes(payload.userId)
                    ? message
                    : {
                        ...message,
                        readBy: [...(message.readBy || []), payload.userId],
                      }
                ),
              }
            : community
        ),
      };
    case READ_COMMUNITY_MESSAGES_FAIL:
      return {
        ...state,
        error: payload.error || "Unable to mark messages as read",
      };

    // --- Socket messages ---
    case "RECEIVED_SOCKET_MESSAGE":
      return {
        ...state,
        myCommunities: state.myCommunities.map((community) =>
          community._id === payload.communityId
            ? (() => {
                const exists = (community.messages || []).some((m) =>
                  m._id === payload.message._id ||
                  m._id === payload.message.id ||
                  m.id === payload.message._id
                );

                const nextMessages = exists
                  ? community.messages || []
                  : [...(community.messages || []), payload.message];

                return {
                  ...community,
                  messages: nextMessages,
                  lastMessage: {
                    content: payload.message.content,
                    senderName: payload.message.senderName,
                    senderImage: payload.message.senderImage,
                  },
                  lastMessageSender: payload.message.senderId,
                  lastMessageTime: new Date().toISOString(),
                };
              })()
            : community
        ),
      };

    // --- Create community ---
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
