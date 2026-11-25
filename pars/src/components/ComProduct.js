import React from 'react'
import { Card ,Image} from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function ComProduct({product}) {
  return (
    <div>

      <Card className="p-3 my-3 rounded">

            <Link to={`/product/${product._id}`}> 
                <Image src={`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}${product.image}`} alt={product.name} fluid />
            </Link>

            <Card.Body>
              <Link to={`/product/${product._id}`} >  
                <Card.Title as="h5">
                  <strong>{product.name}</strong>
                </Card.Title>
              </Link>

              <Card.Text as="div" className='my-3'>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} color={"#F8E825"} />
              </Card.Text>

              <Card.Text as="h5">
                ${product.price}
              </Card.Text>

            </Card.Body>
        </Card>
    </div>
  )
}

export default ComProduct
