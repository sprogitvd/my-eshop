import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {listProductReducer, detailsProductReducer} from './reducers/productReducers'
import {cartReducer} from './reducers/cartReducers'
import {userLoginReducer, userRegisterReducer, userDetailsReducer, UserUpdateProfileReducer } from './reducers/userReducers'
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer} from './reducers/orderReducers'

//چون برای کریت استور فقط باید یه دونه ریدوسر بهش پاس میدادیم اینجا از کامباین ریدوسر استفاده میکنیم که هم قانون رو نقض نکرده باشیم هم بتونیم همه ریدوسرهامون رو به کریتور استور بشناسونیم تا استورها همه بتونن هم دیگه رو ببینن
const reducer= combineReducers({
    listProduct: listProductReducer,
    productDetails: detailsProductReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: UserUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderListMy: orderListMyReducer,

})
const cartFromLocalStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

//شرط
//اگر در لکال استورج کلیدی با نام یوزر اینفو بود
//از لکال استورج گیت ایتم کن یوزر اینفو رو و جی سون ریس پانز بریزش داخل یوزر اینفو فرام لکال استورج
const userInfoFromLocalStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')): null
// در غیر اینصورت اگر نبود نال بردگردون  


const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')): {}


const paymentMethodFromLocalStorage = localStorage.getItem('paymentMethod') ?
    JSON.parse(localStorage.getItem('paymentMethod')): {}

//ممکنه کاربر بارها بیاد لاگین کنه و مرورگرشو میبنده میره فردا میاد برای اینکه کاربر لاگین بمونه و اطلاعاتش باشه انیشال استیت رو با یوزر اینفو پر میکنیم
const initialState = {
    cart: { 
        cartItems: cartFromLocalStorage ,
        shippingAddress: shippingAddressFromLocalStorage,
        paymentMethod: paymentMethodFromLocalStorage,
    },
    userLogin: {userInfo: userInfoFromLocalStorage}
    //به اینشال استیت هم معرفی میکنیم
    //با کلید یوز اینفو مساوی بشه با یوزیر اینفو لکال استورج 
}
const middleware = [thunk]

const store = createStore(reducer, initialState,
     composeWithDevTools(applyMiddleware(...middleware)))



export default  store
