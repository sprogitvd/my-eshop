import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants"
import axios from 'axios'

// اضافه کردن آدرس بک‌اند برای محیط آنلاین
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const fatchProducts = () => async(dispatch) => {
    try{
        dispatch({ type: PRODUCT_LIST_REQUEST })
        const {data} = await axios.get(`${baseURL}/api/v1/products/`)
        dispatch({ 
            type: PRODUCT_LIST_SUCCESS,
            payload: data
         })
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const fatchProductDetails = (id) => async(dispatch) => {
    try{
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const {data} = await axios.get(`${baseURL}/api/v1/products/${id}/`)
        dispatch({ 
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
         }) 
    } catch(error){
        dispatch({ 
            type: PRODUCT_DETAILS_FAIL,
            // اصلاح مهم: به جای error.response فقط متن خطا فرستاده می‌شود
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}