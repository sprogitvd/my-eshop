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

} from '../constants/userConstans'

import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstans'

import axios from 'axios'
import axiosInstance from '../utils/axiosInstance'
import { ORDER_LIST_MY_RESET } from '../constants/orderConstatns'



export const userLoginAction = (email, password) => async (dispatch) => {
    try {
        //اینجا ریدوسر میفهمه که اکشن درحال ریکویست زدن است
        dispatch({// USER_LOGIN_REQUEST
            type: USER_LOGIN_REQUEST,
        })

        const config = {// request setting
            header: {
                'Content-type': 'application/json'
            }
        }
        //اینجا داریم ریکوست رو میزنیم
        const { data } = await axios.post(// send request login
            '/api/v1/users/login/',
            { 'username': email, 'password': password },
            config,
        )
        //اینجا داریم میگیم که ریکوست با موفقیت بود
        dispatch({// USER_LOGIN_SUCCESS
            type: USER_LOGIN_SUCCESS,
            payload: data
            //و دیتا رو پاس میدیم
        })
        //برای اینکه اطلاعات کاربر رو از دست ندیم مثل سبد خرید داخل لکال استورج  مرورگر کاربر ذخیره می کنیم
        localStorage.setItem(// save user information in local storage
            'userInfo',
            JSON.stringify(data)
            //استرینگ فای میومد همه ی این دیتا رو برای ما استرینگی می کرد
            //و با کلید یوزیر اینفو داخل لوکال استورج مرورگر کاربر ذخیره  می کرد
        )
        //اگر هم موارد بالا نشد دیس پچ می کنیم فی ایل رو
    } catch (error) {
        dispatch({// USER_LOGIN_FAIL
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
                //با کلید  پی لود خطا رو پاس میدیم
                //دیتل خطایی هست که قبلا برای  خودمون شحصی سازیش کردیم و با دیتل نشون میدیم یعنی مشخص کردیم چه خطایی نشون بده
        })
    }

}

//در واقع میخوایم یه کاری غیر از این ریترن کردن آبجکت معمولی بکنیم و این رو ریدوسر متوجه نمیشه 
//برای همین ریداکس تانک رو شریک میکنیم با دیس پتچ ریداکس تانک 
export const userLogoutAction = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    //این آبجکت رو دیس پتچ میکنیم به ریداکس تانک
    // که به ریدوسر بده و اجازه بده ما کاری به غیر از ریترن کردن یک آبجکت معمولی انجام بدیم 
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_DETAILS_RESET})
    dispatch({ type: ORDER_LIST_MY_RESET})
}



//یک اکشن کریتور ساده Actioncretor
//الان اگه مابخوایم یک کاری به غیر از ریترن کردن این آبجکت ساده بکنیم  
//پس میومدیم یک تابع دیگه داخل این تابع ایجاد میکردیم که این میشد بدنه ریداکس تانک 
//که این ریداکس تانک بین این گفتگوی اکشن کریتور و ریدوسر بمونه و صحبت ها رو بفهمونه به ریدوسر
export const userRegisterAction = (name, email,password) => async (dispatch)=>{
    try {
        dispatch({ //USER_REGISTER_REQUST
            //ریجستر داره ریکوست میده اول از همه
            type: USER_REGISTER_REQUEST,
        })
        //متغیر config
        //توی هدرت قرار بده این استرینگ رو
        const config = { //requist settin
            header:{
                'Content-type': 'application/json'
            }
        }

        //تنظیم نگاداشت
        const {data} = await axios.post( //register request
            //به عنوان پارامتر اول ما یوآر ال رو پاس میدیم به صورت استرینگی
            '/api/v1/users/register/',
            //پارامتر دوم 
            //این اکشن قراره به ازای سابمیت شدن فرممون صدا زده بشه
            {'name': name, 'email': email, 'password': password },
           config,
        )

        dispatch({ //USER_REQUIST_SUCCESS
            type: USER_REGISTER_SUCCESS,
            payload: data

        })




        //اینجا میتونیم کاربر رو لاگین بکنیم
        //یعنی بعد از اینکه کاربر ثبت نام کرد میتونه لاگین بشه به صورت خودکار
        dispatch({// USER_LOGIN_REQUEST
        type:USER_LOGIN_REQUEST,    
        })

        dispatch({//USER_LOGIN_SUCCESS
            type:USER_LOGIN_SUCCESS,
            //اینجا دیتا رو با کلید پی لود به سمت ریدوسر پاس دادیم
            payload: data

        })


        //اطلاعات کاربر رو توی لکال استورج ذخیره می کنیم
        localStorage.setItem(
            //با کلید یوزر اینفو توی لکال استورج ذخیره بکن
            'userInfo',
            //دیتا رو برای ما استرینگی میکنه
            JSON.stringify(data)

        )


    } catch (error) {
        dispatch({// USER_LOGIN_FAIL
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
            //اگر ارور دات ریزپانز ایرور دات ریزپانز دیتا دیتیل یعنی پیام شخصی سازی شده بود 
            //بیا و ارور ریزپانز دیتا دیتیل رو نشون بده
                ? error.response.data.detail
                : error.message
                //در غیر اینصورت همون پیغام کلی رو بریز ارور ریزپانز
    })
}

}




export const getUserDetailsAction = (id)=> async (dispatch, getState) => {
    try{
        dispatch({//USER_DETAILS_REQUEST
            type: USER_DETAILS_REQUEST
        })

        const {userLogin: { userInfo }} = getState()


        

        const authRequestAxios = axiosInstance(userInfo, dispatch)
         const { data } = await authRequestAxios.get(
            `/api/v1/users/${id}`,
        )

        

        dispatch({//USER_DETAILS_SUCCESS
            type: USER_DETAILS_SUCCESS,
            payload : data
            
        })
    }catch (error) {
        dispatch({// USER_DETAILS_FAIL
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
    })
        }
}



export const userUpdateProfileAction = (user) => async(dispatch, getState) =>{
    try{
        dispatch({//USER_UPDATE_PROFILE_REQUEST
            type: USER_UPDATE_PROFILE_REQUEST
        })
        //یوزر  اینفو رو از گیت استیت میاریم 
        //get token of userInfo...
        const { userLogin: { userInfo } } = getState()


        
        const authRequestAxios = axiosInstance(userInfo, dispatch)
        const {data} = await authRequestAxios.put(//send update profile requist
            'api/v1/users/profile/update/',
            user,
        )

        userInfo.name= data.name

        //پی لود با دیتا پر میشه که از بالا گرفتیم
        dispatch({// USER_UPDATE_PROFILE_SUCCESS
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: userInfo
        })

        //در بالا کاربر اطلاعاتش آپدیت شد پس دوباره باید لاگین کنیم
        dispatch({// USER_LOGIN_SUCCESS
            type: USER_LOGIN_SUCCESS,
            payload: userInfo
        })

        //اطلاعات کاربر رو در لکال استورج ذخیره کردیم تا آپدیت بشه
        localStorage.setItem('userInfo', JSON.stringify(data))


    } catch (error) {
        dispatch({// USER_UPDATE_PROFILE_FAIL
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