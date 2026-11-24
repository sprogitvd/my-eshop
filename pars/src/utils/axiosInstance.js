import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { updateAccessToken } from '../actions/userActions';

// ۱. تغییر اول: خواندن آدرس بک‌اند از متغیر محیطی (اگر در لوکال بود، از 127.0.0.1 استفاده می‌کند)
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

const axiosInstance = (userInfo, dispatch) => {

    const instance = axios.create({
        baseURL,
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo?.access}`
        }
    })

    instance.interceptors.request.use(async req => {
        const user = jwt_decode(userInfo.access)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 5000;

        if (!isExpired) return req

        // ۲. تغییر دوم: اضافه کردن baseURL به آدرس رفرش توکن تا در محیط آنلاین هم درست کار کند
        const response = await axios.post(
            `${baseURL}/api/v1/users/token/refresh/`,
            { refresh: userInfo.refresh },
        )

        dispatch(updateAccessToken(response.data))
        req.headers.Authorization = `Bearer ${response.data.access}`
        return req
    }) 

    return instance
}

export default axiosInstance;