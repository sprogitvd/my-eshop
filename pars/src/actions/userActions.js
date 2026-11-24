import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL ,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants'

import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import axios from 'axios'
import axiosInstance from '../utils/axiosInstance'
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const userLoginAction = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const config = {
            header: { 'Content-type': 'application/json' }
        }
        // استفاده از baseURL
        const { data } = await axios.post(
            `${baseURL}/api/v1/users/login/`,
            { 'username': email, 'password': password },
            config,
        )
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

export const userLogoutAction = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_DETAILS_RESET})
    dispatch({ type: ORDER_LIST_MY_RESET})
}

export const userRegisterAction = (name, email,password) => async (dispatch)=>{
    try {
        dispatch({ type: USER_REGISTER_REQUEST })

        const config = {
            header: { 'Content-type': 'application/json' }
        }

        // استفاده از baseURL
        const {data} = await axios.post(
            `${baseURL}/api/v1/users/register/`,
            {'name': name, 'email': email, 'password': password },
           config,
        )

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
        dispatch({ type: USER_LOGIN_REQUEST })
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
    })
}
}

export const getUserDetailsAction = (id)=> async (dispatch, getState) => {
    try{
        dispatch({ type: USER_DETAILS_REQUEST })

        const {userLogin: { userInfo }} = getState()
        const authRequestAxios = axiosInstance(userInfo, dispatch)

        // اضافه کردن اسلش در آخر آدرس
        const { data } = await authRequestAxios.get(
            `/api/v1/users/${id}/`,
        )

        dispatch({ type: USER_DETAILS_SUCCESS, payload : data })
    }catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
    })
        }
}

export const userUpdateProfileAction = (user) => async(dispatch, getState) =>{
    try{
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST })

        const { userLogin: { userInfo } } = getState()
        const authRequestAxios = axiosInstance(userInfo, dispatch)
        
        // اصلاح اسلش اول و آخر آدرس
        const {data} = await authRequestAxios.put(
            '/api/v1/users/profile/update/',
            user,
        )

        userInfo.name= data.name
        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: userInfo })
        dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

export const updateAccessToken = (obj) => (dispatch, getState) => {
    const { userLogin: { userInfo } } = getState()
    userInfo.access = obj.access
    userInfo.refresh = obj.refresh
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo })
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
}