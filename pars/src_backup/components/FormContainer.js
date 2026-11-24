//یک کامپوننت ایجاد با نام فرم کانتینر
//برای اینکه بخوایم از اون ارث ببریم برای فرم لاگین و استورج و یک استایل مشترک بین این دو فرم رو به این کانتینر بدیم  و از اون استفاده کنیم
//که نخوایم اون رو دوبار توی فرم هامون بنویسیم

import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
//بچه ها ورودی تو هستن 
function FormContainer({children}) {
  return (
    <Container>
      {/* وفتی محتوات از ایکس اس بیشتر شد محتوای داخلیتو سنتر کن */}
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
        {/* توی اسکرین ایکس است دوازده سهم داشته باش و توی ام دی بالا شش سهم داشته باش */}
            {children}
        {/* این بچه ها رو اینجا نمایش بده که این بچه ها درواقع همون فرم های ما هستن */}
        </Col>
      </Row>
    </Container>
  )
}

export default FormContainer
