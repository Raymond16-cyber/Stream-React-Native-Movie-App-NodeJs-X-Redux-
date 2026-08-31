import { ThunkAction } from "redux-thunk";
import { baseURL, getAuthConfig } from "./authAction";
import { RootState } from "../store";
import { AnyAction } from "redux";
import axios from "axios";





export const sendCustomerCareMessageAction = (
    message: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${baseURL}/api/customer-care/send-message`, { message },{
                ...(await getAuthConfig())
            });
            // You can dispatch success action here if needed
        }catch(error){}
    }}
