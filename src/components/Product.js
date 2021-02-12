import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { decodeEntity } from '../utils';

const Product = ({ product }) => {
    return (
        <Card className='my-3 p-3 rounded' key={product._id}>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top' />
                <Card.Body>
                    <Card.Title as='div'>
                        <strong>
                            {product.name}
                        </strong>
                    </Card.Title>
                    <Card.Text as='div'>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </Card.Text>
                    <Card.Text as='h3'>
                        {decodeEntity('&#x20A6;')}{product.price}
                    </Card.Text>
                </Card.Body>
            </Link>

        </Card>
    )
}

export default Product;
