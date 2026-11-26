import React from 'react'
import { Card, Image } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

// تعریف آدرس بک‌اند
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'

function ComProduct({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Image
          src={`${baseURL}${product.image}`} // ← اضافه کردن آدرس بک‌اند به ابتدای عکس
          alt={product.name}
          fluid
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ComProduct