//طراحی یو آیی شسپینگ ادرس
//صفحه ثبت آدرس ارسال سفارش

//درواقع الان ریداکس میتونه اطلاعاتشو از حافظه مرورگر میخونه 
//و فرم من داره اطلاعاتشو از توی  ریداکس میخونه
import React,{useState } from 'react'
import { Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import {useDispatch, useSelector} from 'react-redux'
import {saveShippingAddress} from '../actions/cartActions'
//امرپرت کن کامپوننت مراحل خرید
import CheckoutSteps from '../components/CheckoutSteps'


//چون داریم با ریکت روتر دام مسیر دهی میکنیم میتونیم به هیستوری دسترسی داشته باشیم
function ShippingScreen({ history }) {

    
    const dispatch = useDispatch()
    //از توی استیت ها استیت کارت رو بیار برا من
    const cart = useSelector(state=>state.cart)
    //حالا از طریق شیپینگ ادرس به کارت دسترسی پیدا می کنم
    const { shippingAddress} = cart


    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [country, setCountry] = useState(shippingAddress.country)

    //ایونت ورودی شماست
    const submitHandler = (e)=> {
        e.preventDefault() //حالت پیش فرض کنسل بشه
        //حالا باید در ازای سابمیت شدن فرم
        // باید دیسپتچ بشه اکشنه سیو شیپینگ ادرس که در بالا ایمپورت کردیم
        //تا اطلاعات  کاربر ذخیره بشه و  ما هیستوری . پویش بشیم به صفحه اسلش پیمنت
        dispatch(saveShippingAddress({postalCode,address,city,country}))
        history.push('/payment')
    }

  return (
    <FormContainer>
         {/* مراحل خرید رو قراره بالای صفحه شیپینگ نمایش بدیم */}
        <CheckoutSteps step1 step2/>
      <h1>shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='postalCode' className='mt-4'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
            required //الزامی
            type='text'
            placeholder='Enter postal code'
            //اگر استیت پستال کد مقدار داشت همین پستال کد رو بریز در غیر اینصورت استرینگ خالی
            value={postalCode ? postalCode: " "}
            onChange={(e)=> setPostalCode(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='address' className='mt-4'>
            <Form.Label>Address</Form.Label>
            <Form.Control
            required //الزامی
            type='text'
            placeholder='Enter address'
            //اگر استیت ادرس مقدار داشت همین ادرس  رو بریز در غیر اینصورت استرینگ خالی
            value={address ? address: ""}
            //ویژگی آن چنج اینها مساوی است با اگر که یک تابع پیکانی رو اجرا بکنی که این تابع پیکانی
            //یک ایونت داشته باشه ست می کنه پستال کد رو ای . تارگت . ولیو رو
            onChange={(e)=> setAddress(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city' className='mt-4'>
            <Form.Label>City</Form.Label>
            <Form.Control
            required //الزامی
            type='text'
            placeholder='Enter city'
            value={city ? city: ""}
            onChange={(e)=> setCity(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country' className='mt-4'>
            <Form.Label>Country</Form.Label>
            <Form.Control
            required //الزامی
            type='text'
            placeholder='Enter country'
            value={country ? country: ""}
            onChange={(e)=> setCountry(e.target.value)}
            ></Form.Control>
        </Form.Group>

        <Button
        type='submit'
        className='col-4 mt-4'>Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
