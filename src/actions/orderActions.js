import axios from 'axios'; 
import { 
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    MYORDER_LIST_REQUEST,
    MYORDER_LIST_SUCCESS,
    MYORDER_LIST_FAIL,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_REQUEST,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL
} from "../constants/orderConstants";


export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/orders`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        });

        
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}



export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/orders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });

        
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}



export const payOrder = (orderId, paymentResult, paymentMethod) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const requestBody = {...paymentResult, paymentMethod};

        const { data } = await axios.put(`${process.env.REACT_APP_API}/api/orders/${orderId}/pay`, requestBody, config);

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        });

        
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}


export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: MYORDER_LIST_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/orders/myorders`, config);

        dispatch({
            type: MYORDER_LIST_SUCCESS,
            payload: data
        });

        
    } catch (error) {
        dispatch({
            type: MYORDER_LIST_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}


export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/orders`, config);

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        });

        
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`${process.env.REACT_APP_API}/api/orders/${order._id}/deliver`, {}, config);

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data
        });

         
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error?.response?.data?.message ?? error.message
        });
    }
}
