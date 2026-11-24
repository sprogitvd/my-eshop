//کامپوننت مراحل خرید

import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function CheckoutSteps({step1, step2, step3, step4}) {
    //زمانی که هر کدوم از این استیپ ها وجود داشته باشند یعنی ما توی اون مرحله ایم
  return (
    <Nav className='mb-4 justify-content-center'>
      <Nav.Item>
        { step1 ? (
            //میره به صفحه لاگین اگر ما لاگین رو خالی بنویسیم و کوری پرامتر همراهش نفرستیم 
            //مقدار اسلش فروارد میگیره و میره صفحه محصولات و دیگه برنمی گرده به صفحه شیپینگ
            <LinkContainer to= '/login?redirect=/shipping'>
                {/* به صورت یک لینک نمایشش بده */}
                <Nav.Link>Login</Nav.Link>
            </LinkContainer>
        ):(
            //در غیر اینصورت به صورت غیرفعال نمایش بده
            <Nav.Link disabled>Login</Nav.Link>
        )}
      </Nav.Item>


      <Nav.Item>
        { step2 ? (
            <LinkContainer to= '/shipping'>
                <Nav.Link>Shipping</Nav.Link>
            </LinkContainer>
        ):(
            <Nav.Link disabled>Shipping</Nav.Link>
        ) }
      </Nav.Item>


      <Nav.Item>
        { step3 ? (
            <LinkContainer to= '/payment'>
                <Nav.Link>Payment</Nav.Link>
            </LinkContainer>
        ):(
            <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>



      <Nav.Item>
        { step4 ? (
            <LinkContainer to= '/placeorder'>
                <Nav.Link>Placeorder</Nav.Link>
            </LinkContainer>
        ):(
            <Nav.Link disabled>Placeorder</Nav.Link>
        )}
      </Nav.Item>



    </Nav>
  )
}

export default CheckoutSteps
