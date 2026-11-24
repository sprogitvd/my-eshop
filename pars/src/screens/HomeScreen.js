import React,{useEffect, useState,} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import ComProduct from '../components/ComProduct'
import { fatchProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

/**listProducts از خاصیت یوز سیلیکتور استفاده می کنه که حالت انتخاب داره که توی کلید لیست پروداکت که ریدیوس ماست یک سری کلیدهای داره از جمله
 * ارور و لودینگ و پروداکتز که با کد پایین تر پروداکت رو میخونه و اجزا در یو آیی نمایش داده میشه
 */
function HomeScreen() {
  const dispatch = useDispatch()
  const listProducts = useSelector(state => state.listProduct)
  const {error, loading, products} = listProducts

  useEffect(() => {
    dispatch(fatchProducts())
  }, [])


  
  /**UI products */
  {/* کامپوننت لودیر که خودمون در کامپوننت ها ساختیم با ویژگی اسپینر در بوت استرپ */}
  /**کامپوننت Alerts
         * به کاربر خطا رو با یک رنگ قرمز مشخص می کنه
         */
  
  return (
    <div>
        <h1>Latest products</h1>
        {loading ? <Loader/>
          : error ? <Message variant='danger' text={error} />

             /**اگر خطا نداشتیم */
            :<Row>
                {products.map(product =>(
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <ComProduct product={product}/>
                    </Col>
                ))}
            </Row>
        }

    </div>
  )
}

export default HomeScreen
