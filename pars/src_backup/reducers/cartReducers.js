import { 
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS,

} from '../constants/cartConstatns'

//تعربف آبجکت ها
export const cartReducer = (state={cartItems:[], shippingAddress:{}, PaymentMethod:{}}, action) => {
    switch(action.type){
        case CART_ADD_ITEM:
            const item= action.payload
            const existItem = state.cartItems.find(x=> x.product === item.product)

            if(existItem){
                //update
                return{
                    ...state,
                    //تک تک اعضای کارت آیتم رو بزار ایکس اگر به ازای این ایکس که ایدی رو اسمش رو گزاشتیم پروداکت برابر بود با پروداکت ایکزیست آیتم بروزش کن و گرنه همون ایکس رو سر جای خودش کپی کن
                    cartItems:state.cartItems.map(x => 
                        x.product === existItem.product ? item: x
                    )
                }
            }else{
                //insert
                return{
                    ...state,
                    cartItems:[...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems:state.cartItems.filter(x => x.product !== action.payload)
            }


        case CART_SAVE_SHIPPING_ADDRESS:
            return{
                //ریترن کن یه نمونه از استیت رو
                ...state,
                shippingAddress: action.payload,
                //چرا یه نمونه از استیت رو میفرستیم و بعد میگیم که شیپینگ ادرس رو با اکشن دات پی لود پر کن؟
                //چون اگه من فقط شیپینگ ادرس رو پر بکنم مابقی کلید ها میپرن و فقط شیپینگ ادرس میمونه یعنی کارت اتیم میپره 
                //برا همینه که ما یک نمونه از استیت رو بر میگردونیم 
            }

        
            case CART_SAVE_PAYMENT_METHOD:
                return{
                    ...state,
                    PaymentMethod:action.payload,
                }
                
                //خالی کردن سبد خرید
            case CART_CLEAR_ITEMS:
                return{
                    ...state,
                    cartItems: []
                }

        default:
            return state
    }
}