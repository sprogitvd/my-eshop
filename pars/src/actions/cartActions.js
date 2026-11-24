import { 
    CART_ADD_ITEM , 
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    
} from '../constants/cartConstants'
import axios from 'axios'

export const addToCart = (id, qty)=> async(dispatch, getState) => {

    const {data} = await axios.get(`/api/v1/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name, 
            image: data.image, 
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify( getState().cart.cartItems))
}



export const removeFromCart = (id)=> (dispatch, getState) => {

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
            
    })

    localStorage.setItem('cartItems', JSON.stringify( getState().cart.cartItems))
}



export const saveShippingAddress = (data) => (dispatch, getState) =>{
    //چون قراره توی لکال استورج مرورگرم چیزی رو ذخیره کنم پس باید ریداکس تانک رو هم که یک میان افزار بود وارد این قضیه بکنم
    dispatch({type:CART_SAVE_SHIPPING_ADDRESS, payload:data})
    localStorage.setItem('saveShippingAddress', JSON.stringify(data))
}



export const savePaymentMethod = (data) => (dispatch)=>{
    dispatch({type: CART_SAVE_PAYMENT_METHOD, payload: data})
    localStorage.setItem('savePaymentMethod' , JSON.stringify(data))
}


