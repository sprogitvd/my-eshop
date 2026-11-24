import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,

} from "../constants/productConstatns"
import axios from 'axios'


export const fatchProducts = () => async(dispatch) => {
    try{

        dispatch({ type: PRODUCT_LIST_REQUEST })
        /*await متوقف می کنه و شروع به بررسی ادرس تو گیت می کنه در صورتی که همین ادرس باشه دیس پتچ بعدی رو اجرا می کنه*/
        const {data} = await axios.get('/api/v1/products/')
        dispatch({ 
            type: PRODUCT_LIST_SUCCESS,
            /*تایپ رو بفرست و بعد یک پی لود و چطور پرش بکن با این دیتا که از سرور گرفتی*/
            payload: data
            /**دوباره این تابع یک ابجکت رو دیس پتچ می کنه به ریداکس تانک  ، ریداکس تانک می گه دوباره ابجکت اومد میفرسته به ریدیوسر */
         })

    }catch(error){
        dispatch({ 
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail
            ?error.response.data.detail
            :error.response
    })

}}



/* تعریف اکشن برای صفحه جزئیات محصول */
export const fatchProductDetails = (id) => async(dispatch) => {
    try{

        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        /*await متوقف می کنه و شروع به بررسی ادرس تو گیت می کنه در صورتی که همین ادرس باشه دیس پتچ بعدی رو اجرا می کنه*/
        const {data} = await axios.get(`/api/v1/products/${id}`)
        dispatch({ 
            type: PRODUCT_DETAILS_SUCCESS,
            /*تایپ رو بفرست و بعد یک پی لود و چطور پرش بکن با این دیتا که از سرور گرفتی*/
            payload: data
            /**دوباره این تابع یک ابجکت رو دیس پتچ می کنه به ریداکس تانک  ، ریداکس تانک می گه دوباره ابجکت اومد میفرسته به ریدیوسر */
         }) 

    }catch(error){
        dispatch({ 
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
            ?error.response.data.detail
            :error.response
    })

}}