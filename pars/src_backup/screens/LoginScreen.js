import React,{useState,useEffect} from 'react'
import FormContainer from '../components/FormContainer'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {userLoginAction } from '../actions/userActions'
//دیس پتچ داخل قلب ری اکت ریداکس 
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'


//لوکیشن و هیستوری اینچا دیستراکت میشود چون اینها زیر مجوعه ری اکت رویتیر دام هستند و مسیر دهیمون به این وسیله است و اینها امپورت میشوند
function LoginScreen({location, history}) {
    const redirect = location.search ? location.search.split('=')[1] : '/'
    const tokenResult = location.search ? location.search.split('=')[1] : ""
    //لوکیشن سرچ کوویری یک مسیر رو به ما میداد
    //اگر این بود مقدار ری دایرکت توی تگ لینک رو میخوام
    //پس با استفاده از متد اسپیلیت و جداساز مساوی که بهش میدیم  قبل از مساوی رو با اندیکس 0 درنطر میگیره و بعد  از مساوی اندیکس 1 یعنی عضو دوم
    //در غیر انصورت اسلش فروات قرار بده داخل ریدایرکت


    const dispatch = useDispatch()
    const userLogin = useSelector(state=>state.userLogin)
    const { error, userInfo, loading} = userLogin


    //با ست پسورد یا ست ایمیل مقدار بگیر و با مقدار اولیه استرینگ خالی
    //بار اول که خالیه موقعی که آن چنج بشه مقدار ایمیل و پسورد کاربر توی استیت محلی ذخیره میشه
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //اگر سابمیت هندلر ایونت باشه 
    const submitHandler = (e)=>{
        //صفحه به صورت پیش فرض ری لود میشد که بااین دستور دیگه اینطور نمیشه
        e.preventDefault()
        dispatch(userLoginAction(email, password))
        //یوزر اکشن قراره در ازای سابمیت شدن فرم صدا زده بشه که با دیست پتچ این کار رو میکنیم
    }

    //موقعی که یوزر اینفو باشه داخل استیت هامون یعنی یوزر اینفو مقدار داشته باشه 
    //کاربر دیگه نیازی نیست صفحه لاگین رو ببینه
    //پس با استفاده از هیستوری دات پوش کاربر رو هدایت میکنیم به اون ری دایرکتی که در بالا قرار دادیم کانست ری دایرکت
    useEffect(()=> {
        if (userInfo){
            history.push(redirect)
        }
        //یوز افکت تو بیا در ازای تغییر هیستوری  یعنی به هیستوری نگاه کن به یوزر اینفو و ری دایرکت به ازای تغییر اینها تو دوباره بیا و اجرا بشو
        //اگر این لیست رو خالی یزاریم به ازای هیچ چیز تغییر می کنه
        // و اگه کلا لیست رو نمیزاشتیم به ازای هر تغییر این یوز افکت دوباره اجرا بشه
        //که ما بهش گفتیم در ازای اینهایی که توی لیست گزاشتیم اجرا شو
    }, [history, userInfo, redirect])

  return (
    <FormContainer>


      {error && <Message variant='danger' text={error}/>}
      {loading && <Loader />}
      <h1>sign in</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
            //کادر از نوع ایمیل باشه حتما باید ایمیل وارد بشه
                type='email'
                //متن نمایش به کاربر در کادر ایمیل
                placeholder='Enter Email'
                //باید یک استیت محلی ایجاد کنیم تا بتونیم ولیو و ان چنج رو بهشون مقدار بدیم
                //set Email
                value={email}
                //زمانی که شما اینپوت دارید آن چنج تغییراتی میکنید و اگه بیاید یک تابعی رو اجرا بکنید که این تابع 
                //یک ورودی داره به اسم ایونت یک تابع پیکانی رو اجرا می کنید بیاید ست بکنید  سیت ایمیل رو 
                onChange={(e)=> setEmail(e.target.value)}
                >
            </Form.Control>
        </Form.Group>


        <Form.Group controlId='password' className='my-4'>
            <Form.Label>Password</Form.Label>
            <Form.Control
            //رمز کاربر رو نقطه چین نمایش میده
                type='password'
                placeholder='Enter Password'
                //set Password
                value={password} 
                onChange={(e)=> setPassword(e.target.value)}
                >
            </Form.Control>
        </Form.Group>

        {/* دکمه */}
        <Button
        //نوعت از نوع دکمه ارسال باشه ساب میت
            type='submit'
            // از گونه پرامری  یعنی اولیه باشه
            variant='primary'
            //سایز دکمه کوچکتر بشه
            className='col-4 '
        >
            sign in
        </Button>
      </Form>

      <Row className='my-4'>
        <Col>
            New Customer ?
            {/* ثبت نام کن  */}
            {/* این لینک قراره کاربر رو وصل کنه به صفحه ثبت نام */}
            {/*  اگر ریداریکت وجود داشت این نگاداشت تو به اینصورته که بری به ریجستر در غیر انصورت  */}
            <Link to={redirect ? `/register?redirect= ${redirect}` : `/register`} >
                Register
            </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
