/* صفحه جزئیات محصول */
import React,{useEffect, useState,} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import { Row ,Col, Image, ListGroup, Button, Form, Collapse } from 'react-bootstrap'
import Rating from '../components/Rating'
import {fatchProductDetails} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'


 function ProductScreen({match, history}) {
  const [qty, setQty] = useState(1)
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails

    useEffect(() =>{
        dispatch(fatchProductDetails(match.params.id))
        
    }, [dispatch, match])
    const addToCartHandler = ()=>{
      history.push(`/cart/${match.params.id}?qty=${qty}`)
    }
    
    return (
      <div>
          <Link to="/" className='btn btn-light my-3' > Go Back </Link>

          {loading ? <Loader/>
            : error ? <Message variant='danger' text={error} />
              :
              (
                
          <Row>
          {/* colum Image */}
          <Col sm={12} md={6} lg={6} xl={6}>
            <Image src={product.image} alt={product.name}/>
          </Col>


          {/* Colum Name & Rating نام و ستاره های امتیاز*/}
          <Col sm={12} md={3} lg={3} xl={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h5>{product.name}</h5>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={"#F8E825"} />
              </ListGroup.Item>
            </ListGroup>
          </Col>


          {/* colum Price & status  & Button insert Card قیمت - وضعیت موجودی- دکمه افزودن به سبد خرید*/}
         <Col sm={12} md={3} lg={3} xl={3}>
          <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>
                    price:
                  </Col>
                  <Col>
                    ${product.price}
                  </Col>
                </Row>
              </ListGroup.Item>


              <ListGroup.Item>
              <Row>
                  <Col>
                    Status:
                  </Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>


              {product.countInStock > 0 && (
                <ListGroup.Item>
                <Row>
                  <Col>Qty:</Col>
                  <Col>
                  <Form.Control as= "select" custom value={qty} onChange={(e) => setQty(e.target.value)}>
                    {
                      [...Array(product.countInStock).keys()].map((x) => (
                        /* کلید رو +1 کن و مقدار رو هم +یک کن */
                        <option key={x+1} value={x+1}>
                          {x+1}  {/* اعداد + یک میشن و چاپ میشن */}
                        </option>
                      )) 
                    }
                  </Form.Control>
                  </Col>
                </Row>
            </ListGroup.Item>
              )}
              
              <ListGroup.Item>
                <Button
                onClick={addToCartHandler}
                 type='button' 
                 className='btn-block' 
                 disabled={product.countInStock ===  0}>Add to Cart
                 </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        
        <Row >
          <Col></Col>
          <Col sm={12} md={6} lg={6} xl={6} >
            <strong> Description: {product.description} </strong>
          </Col>
          </Row>

       </Row> )      
      }     

      </div>
    )
}
export default ProductScreen