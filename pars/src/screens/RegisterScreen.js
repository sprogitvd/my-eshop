import React, { useState, useEffect } from 'react'
import FormContainer from '../components/FormContainer'
import { Form, Col, Row, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { userRegisterAction } from '../actions/userActions'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'


function RegisterScreen({ location, history }) {

     // redirect path
    const redirect = location.search ? location.search.split('=')[1] : '/'
    //local states
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [message,setMessage] = useState('') 

    //handle register user
    //هندل کردن ثبت نام کاربر
    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { userInfo, error, loading } = userRegister

    //در ازای سابمیت شدن فرم صدا زده بشه
    //یک ورودی داره به اسم  e یا event
    const submitHandler = (e) => {
        e.preventDefault()  //حالت پیش فرض کنسل بشه
        if (password !== confirmPassword) { // اگر استیت پسورد نامساوی بود با کانفرم پسورد
            setMessage('Password and confirm password do not match !') //این پیام رو ست کن
        } else {
            dispatch(userRegisterAction(name, email, password)) //نام و ایمیل و پسورد رو بهش پاس میدیم
            setName('')
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            setMessage('')
        }
    }

    useEffect(() => {
        if (userInfo) { // چک می کنه اکه یوزر اینفو مقدار داشت 
            history.push(redirect)
        }
    }, [history, redirect, userInfo])


  return (
    <FormContainer>
        <h1>sign up</h1>

        
            
                { error && <Message variant='danger' text={error} />}
                   { message && <Message variant='danger' text={message} />}
                        { message && <Loader />}
                            
            

        <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>FullName</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter FullName'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='mt-4' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='mt-4' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className='mt-4' controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button
                    type='submit'
                    className='my-4 col-4'
                >
                    register
                </Button>
            </Form>

            
            <Row className="my-4">
                <Col>
                    Have an Account ?

                    <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
                        Login
                    </Link>
                </Col>
            </Row>

    </FormContainer>
  )
}

export default RegisterScreen
