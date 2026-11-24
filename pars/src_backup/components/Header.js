import React from 'react'
import { Navbar, Nav, Container, Row, NavDropdown  } from 'react-bootstrap'
import {LinkContainer} from "react-router-bootstrap"
//امپرت های مربوط به لاگین کاربر
import { useSelector, useDispatch } from 'react-redux'
import { userLogoutAction } from '../actions/userActions'


function Header() {

//میخوایم چک کنیم اگر کاربر لاگین کرده اون دراپدون (نام کاربر توی هدر) نمایش داده بشه 
//اگر لاگ اوت کرده گزینه لاگین نمایش داده بشه

//کانست یک ثابت به اسم یوزرلاگین و مساوی هستش با یوز سیلیکتور 
//که یک درخت استیت رو  میداد و یوزرلاگین رو به ما میداد
  const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const dispatch = useDispatch()

    //لوگ هندلر یک  تابع پیکانی هستی
    //قراره توی این لوگ اوت هندلر بیایم اکشن لوگ اوت رو دیس پچ بکنیم پس به فایل یوزر اکشن میرویم
    const logoutHandler = () => {
        dispatch(userLogoutAction())
    }
  return (
    <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand >E-Shop</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">

              <LinkContainer to="/cart">
                <Nav.Link ><i className="fas fa-shopping-cart"></i> Cart</Nav.Link>  
              </LinkContainer>
              
              {/* اگر یوزراینفو وجود داشت نو دراپ دان پروفایل و دراپ دان لوگ اوت رو نمایش بده */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  {/* نو دراپ دان رو توی لینک کانتینر میزارم تا حالت لینک بگیره */}
                   <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    {/* وقتی روی ایونت آن کلیک لوگ اوت اکشنی اعمال شد یعنی کلیک شده روی لوگ اوت 
                    /* بیا و لوگ اوت هندلر رو صدا بزن */ }
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
                ) : (
              <LinkContainer to="/login">
                <Nav.Link ><i className="fas fa-user"></i> Login</Nav.Link>
              </LinkContainer>
            )}

            </Nav>
          </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  )
}

export default Header
